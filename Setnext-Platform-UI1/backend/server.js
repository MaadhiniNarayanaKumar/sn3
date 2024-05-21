const express = require("express");
const serverless = require("serverless-http");
const bcrypt = require('bcryptjs');
const port = process.env.PORT || 4000;
const app = express();

const { DynamoDBDocumentClient, GetCommand, PutCommand, NumberValue } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");


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

app.use(express.json());

const dbclient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dbclient);

app.get("/", (req, res) => {
  res.send("Welcome to SetNext Login ");
});

// app.post('/signup', async (req, res) => {
//   try {
//     const { name, email } = req.body;

//     const existingUser = await docClient.get({
//       TableName: 'setnext-login',
//       Key: {
//         email: email
//       }
//     }).promise();

//     if (existingUser.Item) {
//       return res.status(400).json({ error: 'Email already exists' });
//     }

//     await docClient.put({
//       TableName: 'setnext-login',
//       Item: {
//         email: email,
//       }
//     }).promise();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/signup', async (req, res) => {
  try {
    const { name, password, email } = req.body; 
    console.log(name, email,password)
   
    const existingUserCommand = new GetCommand({
      TableName: 'setnext_login',
      Key: {
        email: email

      },
    });
    console.log(email)


    const existingUser = await docClient.send(existingUserCommand);

    console.log(existingUser)

    if (existingUser.Item) {
      return res.status(400).json({ error: 'email already exists' });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    // console.log(hashedPassword)

    await docClient.send(new PutCommand({
      TableName: 'setnext_login',
      Item: {
        
        email: email,
        name: name,
        password:hashedPassword,
      }
    }));

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Auth API
app.post("/auth", async (req, res) => {

  console.log("Authentication Call Received");
  console.log("email", req.body.email);
  console.log("password", req.body.password);
  try{

    let email = req.body.email;
    let password = req.body.password;

    const command = new GetCommand({
      TableName: "setnext_login",
      Key: {
        email: email,
      },
    });
    const response = await docClient.send(command);
    if (!response.Item) {
      return res.status(401).send({
        message: "Invalid credentials"
      });
    }
    // console.log(response.Item);
    const validPassword = await bcrypt.compare(password, response.Item.password);
    if (validPassword) {
      
      res.send({ authStatus: "true", role: response.Item.role });
    } else {
      res.send({ authStatus: "false" });
    }
  }catch(err){
    console.log(err)
  }
});




// Start the server
if (process.env.ENVIRONMENT === "production") {
  exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
}
