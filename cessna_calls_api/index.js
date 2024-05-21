const express = require("express");
const serverless = require("serverless-http");
const bcrypt = require("bcryptjs");
const port = process.env.PORT || 4000;
const app = express();

const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  NumberValue,
} = require("@aws-sdk/lib-dynamodb");
const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { DynamoDBClient, QueryCommand, PutItemCommand,UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { v4: uuidv4 } = require("uuid");
const {BedrockRuntimeClient,InvokeModelCommand} =  require("@aws-sdk/client-bedrock-runtime");
const modelClient = new BedrockRuntimeClient({ region: "us-east-1" });


const QuickFilters = {
  FifteenMin: 0,
  ThirtyMin: 1,
  OneHour: 2,
  TwoHour: 3,
  FourHour: 4,
  SixHour: 5,
  TwelveHour: 6,
  Today: 7,
};

app.use(express.json());

const allowedOrigins = ["http://localhost:4200", "https://cessna.setnext.ai"];

// Add headers
app.use(function (req, res, next) {
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', 'https://cessna.setnext.ai');

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
// app.use(allowCrossDomain);
const sqsclient = new SQSClient({ region: "us-east-1" });
const dbclient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dbclient);
const traclient = new TranscribeClient({ region: "us-east-1" });

app.get("/", (req, res) => {
  res.send("Welcome to SetNext API");
});

//Signup API
app.post("/signup", async (req, res) => {
  
  try {
    console.log('================================================')
    const {
      phoneno,
      record_date,
      firstname,
      lastname,
      password,
      email,
      address,
      city,
      state,
      role,
      pin,
      branch,
      access_role,
      functional_role
    } = req.body; // Changed field name from 'pwd' to 'password'
    console.log(req.body)
    // console.log(password);
    const existingUserCommand = new GetCommand({
      TableName: "cessna_user",
      Key: {
        phoneno: phoneno,
      },
    });

    const existingUser = await docClient.send(existingUserCommand);

    console.log(existingUser);
    if (existingUser.Item) {
      console.log('alreaddy')
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword)

    await docClient.send(
      new PutCommand({
        TableName: "cessna_user",
        Item: {
          phoneno: phoneno,
          firstname: firstname,
          lastname: lastname,
          password: hashedPassword,
          email: email,
          address: address,
          city: city,
          state: state,
          role: role,
          pincode:pin,
          branch:branch,
          functional_role:functional_role,
          access_role:access_role
        },
      })
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Authentication API
app.post("/auth", async (req, res) => {
  let accumulated = [];
  console.log("Authentication Call Received");
  console.log(req.body);
  // console.log("Username", req.body.username);
  // console.log("Password", req.body.password);
  let uname = req.body.phoneno;
  let pwd = req.body.password;
  // console.log(uname, pwd);
  const command = new GetCommand({
    TableName: "cessna_user",
    Key: {
      phoneno: uname,


    },
  });
  // const params = {
  //   TableName: 'cessna_user',
  //   KeyConditionExpression: 'phoneno = :pk',
  //   ExpressionAttributeValues: {
  //     ':pk': { S: uname }
  //   }
  // };
  // const command = new QueryCommand(params);
  // const result = await dbclient.send(command);
  // let items = result.Items;
  // console.log(items)
  // const unmarshalled = items.map((i) => unmarshall(i));
  // console.log("unmarshalling done");
  // accumulated = [...accumulated, ...unmarshalled];
  // console.log(response.Item)

  const response = await docClient.send(command);
  console.log(response.Item);
  
  const validPassword = await bcrypt.compare(pwd, response.Item.password);
  if (validPassword) {
    response.Item.password="##"
    res.send({
      auth_status: "true",
      user_data:response.Item
    }); //, role: response.Item.role, phoneno: response.Item.phoneno, email: response.Item.email
  } else {
    res.send({ authStatus: "false" });
  }
});

//AppointmentBooking API
app.post("/appointment", async (req, res) => {
  try {
    const { phoneno, selectedDate, selectedSlot, description, Recording } = req.body;
    if (!phoneno || !selectedDate || !selectedSlot) {
      return res
        .status(400)
        .json({ error: "User ID, date, and time are required." });
    }
    console.log(req.body)

    let transcription_name = Recording.substring(
      Recording.lastIndexOf("/") + 1,
      Recording.lastIndexOf(".")
    );

    var params = {
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/764374292299/cessna_consulting_input_queue",
      MessageBody: "{"+"\"phoneno\""+ ": " + "\""+phoneno+"\"" +", " + "\"Recording\"" + ": " +"\""+Recording+"\""+"}",
      DelaySeconds: 10,
    };
    const command = new SendMessageCommand(params);
      // console.log(command)
      const response = await sqsclient.send(command);
      // console.log("SQS Response ", response);
      console.log("SQS Message send");
      const io = {
        // GetTranscriptionJobRequest
        TranscriptionJobName: transcription_name, // required
      };
      console.log("started");
      const cmd = new GetTranscriptionJobCommand(io);

      const get_status = async () => {
        try {
          const resp = await traclient.send(cmd);
          // console.log(resp.TranscriptionJob)
          if (resp.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
            console.log(
              "Transcription job status:",
              resp.TranscriptionJob.TranscriptionJobStatus
            );
            res
              .status(resp.$metadata.httpStatusCode)
              .json({ message: "Transcription job completed" });
          } else if (resp.TranscriptionJob.TranscriptionJobStatus === "FAILED") {
            return res.status(500).json({ error: "Transcription job failed." });
          } else {
            console.log(
              "Transcription job status:",
              resp.TranscriptionJob.TranscriptionJobStatus
            );
            setTimeout(get_status, 5000);
          }
        } catch (err) {
          console.log(err);
          // res.status(500).json({ message: err});
          setTimeout(get_status, 5000);
        }
    };
    await get_status();



    await docClient.send(
      new PutCommand({
        TableName: "cessna_appointment",
        Item: {
          appoitment_id: uuidv4(),
          phoneno: phoneno,
          selectedDate: selectedDate,
          selectedSlot: selectedSlot,
          description: description,
          Recording: Recording,
        },
      })
    );

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Transcription API
app.get("/test", async (req, res) => {
  res.send("test works");
});

app.post("/phoneNumbers", async (req, res) => {
  try {
    console.log(req.body)
    let phonenumber = req.body.params.cd
    console.log(phonenumber);
    const phoneNumbers = await gethistory(phonenumber);
    res.json(phoneNumbers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/transcribe", async (req, res) => {
  try {
    console.log(req.body);
    const { number, petName, age, petType, breed, weight, Recording } = req.body;
    let transcription_name = Recording.substring(
      Recording.lastIndexOf("/") + 1,
      Recording.lastIndexOf(".")
    );
    // let partitionKey =  phoneno;
    // let sortKey = record_date
    // console.log(Recording);
    // console.log(PhoneNo);
    // console.log(Pet_no);
    var params = {
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/764374292299/cessna_consulting_input_queue",
      MessageBody: "{"+"\"number\""+ ": " + "\""+number+"\"" +", " + "\"petName\"" + ": " +"\""+petName+"\""+", " + "\"age\"" + ":"+"\""+age+"\""+", "+"\"petType\"" + ":"+"\""+petType+"\""+", "+"\"breed\"" + ":" + "\""+breed+"\""+", "+"\"weight\"" + ":"+"\""+weight+"\"" + ", "+"\"Recording\"" + ":"+"\""+Recording+"\""+"}",
      DelaySeconds: 10,
    };
    const command = new SendMessageCommand(params);
    // console.log(command)
    const response = await sqsclient.send(command);
    // console.log("SQS Response ", response);
    console.log("SQS Message send");
    const io = {
      // GetTranscriptionJobRequest
      TranscriptionJobName: transcription_name // required
    };
    console.log("started");
    const cmd = new GetTranscriptionJobCommand(io);

    const get_status = async () => {
      try {
        const resp = await traclient.send(cmd);
        // console.log(resp.TranscriptionJob)
        if (resp.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
          console.log(
            "Transcription job status:",
            resp.TranscriptionJob.TranscriptionJobStatus
          );
          res
            .status(resp.$metadata.httpStatusCode)
            .json({ message: "Transcription job completed" });
        } else if (resp.TranscriptionJob.TranscriptionJobStatus === "FAILED") {
          return res.status(500).json({ error: "Transcription job failed." });
        } else {
          console.log(
            "Transcription job status:",
            resp.TranscriptionJob.TranscriptionJobStatus
          );
          setTimeout(get_status, 5000);
        }
      } catch (err) {
        
        // res.status(500).json({ message: err});
        setTimeout(get_status, 5000);
      }
    };
    await get_status();
    // console.log(re);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/chats/", async(req,res)=>{
  
  try{
    console.log("hi",req.body)
    let phonenumber = req.body["phonenumber"]
    let detailedStudy =""
    console.log(phonenumber);
    const callhistory = await gethistory(phonenumber);
    console.log(callhistory)
    callhistory.forEach((entry) => {
      // Check if the 'ai_narration' object exists in the current entry
      if (entry.hasOwnProperty('ai_narration')) {
          // Extracting the 'ai_narration' object from the current entry
          let aiNarration = entry.ai_narration;
          
          // Check if 'DetailedStudy' exists in the 'ai_narration' object
          if (aiNarration.hasOwnProperty('DetailedStudy')) {
              // Extracting the 'DetailedStudy' from the 'ai_narration' object
              detailedStudy = detailedStudy +""+aiNarration.DetailedStudy;
              
              // Logging or using the 'detailedStudy' variable as needed
              
          } else {
              // 'DetailedStudy' does not exist in 'ai_narration'
              console.log("")
          }
      } else {
          // 'ai_narration' object not present in this entry
          console.log("")
      }
  });

    
    // res.json(callhistory);
    let convo = detailedStudy+"\n" +"question:"+ req.body.message.text
    
    console.log("centxt",convo)

    const prePrompt =  `You're Conversational Chat model for Cessna Life Line.
    if the question contains greetings like "hi", "how are you","hy" greet back the user politely.If the incoming context is only question withount any context you should reply i do not have the context.Do not answer from your own knowledge,if you don't know say don't know.
    Answer the question by referring all the calls from the given context carefully whithout missing any call scenarios.
    return your response only in markdown format.
                        `
    const prompt = prePrompt  +convo ;
    // console.log("prompt",prompt);
    // console.log(req.body)
    

    const modelInput = {
      // You can change the modelId
      // "anthropic.claude-v1"
      // "anthropic.claude-instant-v1"
      // "anthropic.claude-v2"
      //anthropic.claude-3-sonnet-20240229-v1:0
      modelId: "anthropic.claude-v2:1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: `\n\nHuman:${prompt}\n\n Assistant:`,
        max_tokens_to_sample: 3000,
        temperature: 0.1,
        // top_k: 250,
        top_p: 1,
      }),
    };

    const modelCommand = new InvokeModelCommand(modelInput);
    // console.log("hiiii",modelCommand)
  
    const modelResponse = await modelClient.send(modelCommand);


  // Save the raw response
  
  const rawRes = modelResponse.body;
  

  
  // console.log("Model Response ",modelResponse)
  // console.log("Model Response Body ",modelResponse.body)

  // Convert it to a JSON String
  const jsonString = new TextDecoder().decode(rawRes);
  // console.log("decoded response", rawRes)


  // Parse the JSON string
  const parsedResponse = JSON.parse(jsonString);
  
  // const data = { result: parsedResponse.completion };
  
  // console.log("result",data.result);
  // console.log(data.result[0]);
  
  
  // let extract = extractJSON(data.result);
  
  // console.log("extracted ", extract)
  console.log(parsedResponse.completion)  
  res.send({response:parsedResponse.completion})
    
  // res.json(extract);
  }
  catch(err){
    console.log("err",err)
    res.status(500).json({ error: "Internal server error" });

  }
})




app.get("/calls", async (req, res) => {
  console.log("Call Received from Cessna UI");

  console.log("CD", req.query.cd);
  let cd = req.query.cd;

  let from_dt_string = "";
  let to_date_string = "";
  let partitionKey = "";

  console.log("queries", req.query);
  console.log("queries qf", req.query.qf);

  let istStartOfDayInUTC = getISTStartOfDayInUTC();
  let istEndOfDayInUTC = getISTEndOfDayInUTC();
  console.log("Start of the Day", istStartOfDayInUTC.toUTCString());
  console.log("ISOSTring", istStartOfDayInUTC.toISOString());
  console.log("End of the Date", istEndOfDayInUTC.toUTCString());
  console.log("ISOSTring", istEndOfDayInUTC.toISOString());

  let from_dt = new Date();
  console.log("FROM_DT_UTC:  ", from_dt);
  let to_dt = new Date();
  to_dt = subtractHours(to_dt, 1);
  console.log("TO_DT_UTC:  ", to_dt);
  from_dt_string = istStartOfDayInUTC.toISOString();
  console.log("FROM_DT_STRING:  ", from_dt_string);
  to_date_string = istEndOfDayInUTC.toISOString();
  console.log("TO_DT_STRING:  ", to_date_string);
  partitionKey =
    new Date().getDate() +
    "-" +
    new Date().getMonth() +
    1 +
    "-" +
    new Date().getFullYear();

  const res1 = await getCallItems(from_dt_string, to_date_string, req.query.cd);
  // getAllItems()
  //   .then(console.log)
  //   .catch(console.error);
  console.log("Total Count: ", res1.length);
  // console.log(res1);
  res.json(res1);
  // try {
  //   const phoneNumber = req.query.phonenumber;
  //   console.log("Received phone number:", phoneNumber);

  //   const callHistory = await gethistory(phoneNumber);
  //   res.json(callHistory);
  // } catch (error) {
  //   console.error("Error fetching call history:", error);
  //   res.status(500).json({ error: "Internal server error" });
  // }
});


app.get("/calls/:id", async (req, res) => {
  try {
    let ft = req.query.ft;
    const id = req.params.id;
    console.log("FT: ",ft)

    if (ft == "uuid") {

      let call_date = id.split("|")[0]
      let caller_id = id.split("|")[1]

      const input = {
        ExpressionAttributeValues: {
          ":pk": { S: call_date },
          ":sk": { S: caller_id },
          // ":sk": { S: sortKey}
        },
        KeyConditionExpression: "call_date = :pk AND caller_id = :sk",
        ProjectionExpression: "call_date,caller_id,start_datetime,caller_number,caller_number_raw,event,additional_parameters, ai_narration, transcript, media_url,department_id,department_name,india_datetime",
        TableName: "cessna_call_logs_test_db",
      };    
      
        const command = new QueryCommand(input);

      // const command = new GetCommand({
      //   TableName: "cessna_logs_db",
      //   Key: {
      //     call_date: call_date,
      //     caller_id: caller_id

      //   },
      // });
      const response = await docClient.send(command);
      console.log(response)

      // return res.json(response.Items[0]); 
      let items = response.Items;   
      const unmarshalled = items.map((i) => unmarshall(i));
      console.log("unmarshalling done");
      return res.json(unmarshalled)
  }
    else {

      const phoneNumber = req.params.id;
      console.log(req.params.id)
      console.log("Received phone number:", phoneNumber);
      const callHistory = await gethistory(phoneNumber);
      res.json(callHistory);
    }

  } 
  catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({ error: "Internal server error" });
  }

});



const gethistory = async (phonenumber) => {
  let accumulated = [];
  const input = {
    ExpressionAttributeValues: {
      ":cd": { S: phonenumber },
    },
    KeyConditionExpression: "caller_number_raw = :cd",
    ProjectionExpression: "call_date,caller_id,start_datetime,caller_number,caller_number_raw,event,additional_parameters, ai_narration, transcript, media_url,department_id,department_name,india_datetime",
    TableName: "cessna_call_logs_test_db",
    IndexName: "caller_number_raw-start_datetime-index",
    limit: 20
  };

  try {
    const command = new QueryCommand(input);
    const result = await docClient.send(command);
    let items = result.Items;
    const unmarshalled = items.map((i) => unmarshall(i));
    console.log("unmarshalling done");
    accumulated = [...accumulated, ...unmarshalled];
    return accumulated;
  } catch (error) {
    console.error("Error getting phone numbers:", error);
    throw error;
  }
};

const getCallItems = async (from, to, partitionKey) => {
  let result, ExclusiveStartKey;

  let accumulated = [];

  let i = 0;

  do {
    // let from_dt='2024-01-11T03:30:01.000Z'
    // let to_dt='2024-01-11T04:30:01.000Z'

    var input = {
      ExpressionAttributeValues: {
        ":cd": { S: partitionKey },
      },
      // ':from_dt': {S: from},':to_dt':{S: to},':cd':{S: partitionKey}},
      // KeyConditionExpression: 'call_date = :cd and begins_with(caller_id, :dept)',
      // FilterExpression:'start_datetime BETWEEN :from_dt AND :to_dt',
      KeyConditionExpression: "call_date = :cd",
      ProjectionExpression:
        "call_date,caller_id,start_datetime,caller_number,caller_number_raw,event,additional_parameters,ai_narration,transcript,media_url,department_id,department_name",
      Limit: 100,
      TableName: "cessna_logs_db",
      ExclusiveStartKey,
      // FilterExpression: 'contains (Subtitle, :topic)',
    };
    const command = new QueryCommand(input);
    result = await docClient.send(command);
    ExclusiveStartKey = result.LastEvaluatedKey;
    let items = result.Items;
    const unmarshalled = items.map((i) => unmarshall(i));
    // console.log(unmarshalled);
    // console.log(...unmarshalled);
    console.log("unmarshalling done");

    // const unmarshalled = items.map((i) => unmarshall(i));
    // console.log(unmarshalled);
    accumulated = [...accumulated, ...unmarshalled];

    i = i + 1;
    console.log("page ", i);
    console.log(
      "accumulation completed, length of the page is",
      accumulated.length
    );
    console.log("length ", result.Items.length);
    console.log("LastKey ", result.LastEvaluatedKey);
  } while (result.LastEvaluatedKey);

  return accumulated;
};

function subtractHours(date, hours) {
  date.setHours(date.getHours() - hours);

  return date;
}
function subtractMinutes(date, minutes) {
  date.setMinutes(date.getMinutes() - minutes);
  return date;
}

function getISTStartOfDayInUTC() {
  // Create a date object for the current date
  let now = new Date();

  // Set the time to midnight IST (00:00 IST)
  // IST is UTC+5:30, so we set hours to 5 and minutes to 30
  now.setUTCHours(0, 0, 0, 0); // Reset to midnight in UTC
  now.setUTCHours(now.getUTCHours() - 5); // Subtract 5 hours for IST
  now.setUTCMinutes(now.getUTCMinutes() - 30); // Subtract 30 minutes for IST

  // The date is now set to the start of the day in IST, but in UTC
  return now;
}

function getISTEndOfDayInUTC() {
  // Create a date object for the current date
  let now = new Date();

  // Set the time to just before midnight IST (23:59:59.999 IST)
  // IST is UTC+5:30, so we set hours to 23 and minutes to 59, seconds to 59, milliseconds to 999
  now.setUTCHours(23, 59, 59, 999); // Set to just before midnight in UTC
  now.setUTCHours(now.getUTCHours() - 5); // Subtract 5 hours for IST
  now.setUTCMinutes(now.getUTCMinutes() - 30); // Subtract 30 minutes for IST

  // The date is now set to the end of the day in IST, but in UTC
  return now;
}

app.get("/user/:role", async (req, res) => {
  console.log("hi patient")
  try {
    const role = req.params.role; 
    console.log(req.params.role)
    console.log("Received phone number:", role);
    const callHistory = await getpatienthistory(role);
    res.json(callHistory);
  } catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getpatienthistory = async (role) => {
  let accumulated = [];
  const input = {
    ExpressionAttributeValues: {
      ":cd": { S: role },
    },
    KeyConditionExpression: "functional_role = :cd",
    TableName: "cessna_user",
    IndexName: "functional_role-branch-index",
  };

  try {
    const command = new QueryCommand(input);
    const result = await docClient.send(command);
    let items = result.Items;
    const unmarshalled = items.map((i) => unmarshall(i));
    console.log("unmarshalling done");
    accumulated = [...accumulated, ...unmarshalled];

    return accumulated;
  } catch (error) {
    console.error("Error getting phone numbers:", error);
    throw error;
  }
};

app.get("/patienthistory/:patientid", async (req, res) => {
  console.log("patienthistory")
  try {
    const patient_id = req.params.patientid; 
    console.log(req.params.patientid)
    console.log("Received phone number:", patient_id);
    const callHistory = await patienthistory(patient_id);
    res.json(callHistory);
  } catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const patienthistory = async (patient_id) => {
  let accumulated = [];
  const input = {
    ExpressionAttributeValues: {
      ":cd": { S: patient_id },
    },
    KeyConditionExpression: "patient_id = :cd",
    TableName: "cessna_history_test",
  };

  try {
    const command = new QueryCommand(input);
    const result = await docClient.send(command);
    let items = result.Items;
    const unmarshalled = items.map((i) => unmarshall(i));
    console.log("unmarshalling done");
    accumulated = [...accumulated, ...unmarshalled];

    return accumulated;
  } catch (error) {
    console.error("Error getting phone numbers:", error);
    throw error;
  }
};

if (process.env.ENVIRONMENT === "production") {
  exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
}



//Updata 1 User Data
app.put("/users/updinactive", async (req, res) => {
  console.log("hi user")
  try {
    const body=req.body;
    console.log(body.phno)
    // console.log("Received phno:", phno,typeof(phno));
    const callHistory = await activateUser(body);
    res.json({"status":callHistory.$metadata.httpStatusCode});
  } catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const activateUser = async (body) => {
  let phno=body.phoneno;
  let isact=body.isActive;
  const command = new UpdateItemCommand({
    TableName: "cessna_user",Key: {
      phoneno: { S: phno },
    },
    UpdateExpression: "set isActive = :isActive",
    ExpressionAttributeValues: {
      ":isActive": { S: isact },
    },
    ReturnValues: "ALL_NEW",
  });
  // const command = new PutItemCommand({
  //   TableName: "cessna_user",
  //   Item: {
  //     phoneno: { S: phno },
  //     isActive: { S: isact }
  //   }});
  try {
    const response = await docClient.send(command);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error getting phone numbers:", error);
    throw error;
  }
};
app.post("/users/upduser", async (req, res) => {
  console.log("hi user")
  try {
    const body=req.body;
    console.log(body.phoneno)
    // console.log("Received phno:", phno,typeof(phno));
    const callHistory = await updUser(body);
    res.json({"status":callHistory});
  } catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const updUser = async (body) => {

  console.log(body)
  const command = new PutCommand({
    TableName: "cessna_user",
    Item:body
  })
  try {
    console.log('body.pet_details',body.pet_details);
    const response = await docClient.send(command);
    console.log('response',response);
    return response;
  } catch (error) {
    console.error("Error getting phone numbers:", error);
    throw error;
  }


  
};

app.put("/users/updpwd", async (req, res) => {
  console.log("hi user")
  try {
    const phno = req.body.phno;
    const password = req.body.password;
    
    
    // console.log(req.params.phno)
    console.log("Received phno:", phno,typeof(phno));
    const callHistory = await updpwd(phno,password);
    res.json(callHistory.$metadata.httpStatusCode);
  } catch (error) {
    console.error("Error fetching call history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updpwd = async (phno,password) => {
  const salt = await bcrypt.genSalt(10);
  console.log('salt',salt)
  
  let hashedPassword = ''
  hashedPassword = await bcrypt.hash(password, salt);
  console.log('hashedPassword',hashedPassword)
 
  const command = new UpdateItemCommand({
    TableName: "cessna_user",
    Key: {
      phoneno: { S: phno },
    },
    UpdateExpression: "set password = :password",
    ExpressionAttributeValues: {
      ":password": { S: hashedPassword },
    },
    ReturnValues: "ALL_NEW",
  });
  try {
    const response = await docClient.send(command);
    console.log("response",response);
    return response;
  } catch (error) {
    console.error("Error getting phone numbers:", error);
    throw error;
  }
};