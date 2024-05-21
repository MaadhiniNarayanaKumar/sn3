import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from "@angular/core";
import {
  GuiCellView,
  GuiColumn,
  GuiColumnMenu,
  GuiFooterPanel,
  GuiInfoPanel,
  GuiPaging,
  GuiPagingDisplay,
  GuiRowColoring,
  GuiRowDetail,
  GuiSearching,
  GuiSorting,
  GuiTitlePanel,
} from "@generic-ui/ngx-grid";
import { CallService } from "../../services/call.service";
import { DatePipe } from "@angular/common";
import { interval } from "rxjs";
import { FormControl } from "@angular/forms";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { formatDate } from "@angular/common";
import _, { forEach } from "lodash";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { Sentiment } from "@aws-sdk/client-transcribe-streaming";

@Component({
  selector: "app-calls",
  templateUrl: "./calls.component.html",
  styleUrl: "./calls.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallsComponent implements OnInit {
  fromDate = new FormControl(formatDate(new Date(), "dd-MM-yyyy", "en"));
  phone_number = new FormControl();
  toDate = new FormControl(this.getLocalDate());
  isLoading = false;
  loading: boolean = false;

  isCollapsed = true;
  filtersButtonText = "Filters";
  rowColoring = GuiRowColoring.EVEN;

  title = "cessna-ui";
  Items: any = [];
  source: Array<any> = [];
  theme = "Material";
  currentDate = new Date();
  localDate = "";
  sorted_date: any = [];

  timeLeft: number = 60;
  interval: any;


  sentiments: any[] = [
    "All",
    "Worried",
    "Anxious",
    "Neutral",
    "Frustrated",
    "concerned",
  ];


  ratings: any[] = [
    "All",
    "Excellent",
    "Good",
    "Normal",
    "Poor",
  ];

  
   departments: any[] = [
    "All",
    "EC-Clinic",
    "Navi Mumbai ",
    "Dmlr",
    "Extension",
    "Ggn",
    "Pet store",
    "Sadashiv Nagar",
    "Pet Resort"
  ];


  time: any[]=[
    "Last 15 Minutes",
    "Last 30 Minutes",
    "Last 1 Hour",
    "Last 2 Hours",
    "Last 4 Hours",
    "Last 8 Hours",
    "Today"

  ]  
 
  
  dropClicked(time:String) {
 
    console.log("Dropdown clicked 1");
    console.log("src",this.source)
    let date : any
   
    this.Items = [];
    if(time.toLocaleLowerCase()=="last 15 minutes"){
      date = new Date(this.currentDate.getTime()-15*60*1000)}
    if(time.toLocaleLowerCase()=="last 30 minutes"){
      date = new Date(this.currentDate.getTime()-30*60*1000)
      console.log("date",date)}
    if(time.toLocaleLowerCase()=="last 1 hour"){
      date = new Date(this.currentDate.getTime()-60*60*1000)
      console.log("date",date)}
    if(time.toLocaleLowerCase()=="last 2 hours"){
      date = new Date(this.currentDate.getTime()-120*60*1000)
      console.log("date",date)}
    if(time.toLocaleLowerCase()=="last 4 hours"){
      date = new Date(this.currentDate.getTime()-240*60*1000)
      console.log("date",date)}
    if(time.toLocaleLowerCase()=="last 8 hours"){
      date = new Date(this.currentDate.getTime()-480*60*1000)
      console.log("date",date)}
    if(time.toLocaleLowerCase()=="today"){
      date = new Date(this.currentDate)
      console.log("date",date)}

    this.Items = [];

        this.sorted_date.forEach((x: any, i: any) => {
          // console.log(i);
          if (x["ai_narration"] == undefined) {
            return;
          }
          else if(time != "Today" && new Date(x["start_datetime"])<date){
            console.log("coming date")
            
            return
          }

          //  console.log(x['ai_narration'].Category);
          // console.log(x);
          let call = {
            caller_numer: "",
            category: "",
            mood: "",
            recepitionist_rating: "",
            sentiment: "",
            media_url: "",
            date_time: new Date(),
            dept_name: "",
            duration: "",
            narration: "",
            isAppointmentRelated: "",
            isOrderRelated: "",
            reception_rating_condition: "",
            summary: "",
            pk: "",
            Recommendation_promotion :"",
            Recommendation_call_handling :"",
          
          };
          call.caller_numer = x["caller_number_raw"];
          call.pk =
            x["caller_number_raw"] +
            "|" +
            x["call_date"] +
            "|" +
            x["caller_id"];
          call.category = x["ai_narration"].Category;
          call.media_url = x["media_url"];
          call.mood = x["ai_narration"]["Mood"];
          call.recepitionist_rating = x["ai_narration"]["recepitionist_rating"];
          call.sentiment = x["ai_narration"]["Sentiment"];
          call.narration = x["ai_narration"]["DetailedStudy"];
          call.dept_name = x["department_name"];
          call.isAppointmentRelated = x["ai_narration"]["isAppointmentRelated"];
          call.isOrderRelated = x["ai_narration"]["isOrderRelated"];
          call.reception_rating_condition = x["ai_narration"]["reception_rating_condition"];
          call.Recommendation_promotion = x["ai_narration"]["Recommendation_promotion"];
          call.Recommendation_call_handling = x["ai_narration"]["Recommendation_call_handling"];
          call.duration = x["duration"];
          if (x["ai_narration"]["Summary"]) {
            call.summary = x["ai_narration"]["Summary"];
          } else {
            call.summary = "";
          }
          let dt = x["start_datetime"];
          let ldt = new Date(dt);
          // ldt.setHours(ldt.getHours() + 5);
          // ldt.setMinutes(ldt.getMinutes() + 30);
          call.date_time = ldt;
    
          this.Items.push(call);
        });
    
        this.source = this.Items;
        console.log("source is", this.source)
 
        this.changeDetectorRef.detectChanges();
    
        console.log("source is fixed");
        // console.log(this.Items);
      }
 
  getLocalDate() {
    let localDate = new Date(new Date().toUTCString());
    localDate.setHours(localDate.getHours() + 5);
    localDate.setMinutes(localDate.getMinutes() + 30);
    let localCompleteDate2 = localDate.toISOString();
    let localDate2 = localCompleteDate2.substring(
      0,
      localCompleteDate2.length - 1
    );
    return localDate2;
  }

  // localCompleteDate2 = this.localDate.substring(0, this.localDate.length - 1);

  constructor(
    private callService: CallService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router
  ) {
    //  this.getLocalDate();
  }

  showDetails(item: any): void {
    alert(item.name);
  }

  remove(item: any): void {
    alert("Remove item: " + item.name);
  }

  sortDates(dates: string[]): string[] {
    const sortedList = _.orderBy(dates, ["start_datetime"], ["desc"]);
    return sortedList;
  }

  getDateString() {
    let dt = new Date();

    let month = (dt.getMonth() + 1).toString().padStart(2, "0");
    let day = dt.getDate().toString().padStart(2, "0");

    let year = new Date().getFullYear();
    let dateString = day + "-" + month + "-" + year;
    // return dateString
    return dateString;
  }

  getphonehistory(){
    console.log(this.phone_number.value)
       this.loading = true;
    this.Items = [];

    const phoneNumber: any = this.phone_number.value;


    this.callService.gethistory(phoneNumber).subscribe(
      (result) => {
        console.log("hii",result.reverse());

        result.forEach((x: any, i: any) => {
          // console.log(i);
          if (x["ai_narration"] == undefined) {
            return;
          }

          //  console.log(x['ai_narration'].Category);
          // console.log(x);
          let call = {
            caller_numer: "",
            category: "",
            mood: "",
            recepitionist_rating: "",
            sentiment: "",
            media_url: "",
            date_time: new Date(),
            dept_name: "",
            duration: "",
            narration: "",
            isAppointmentRelated: "",
            isOrderRelated: "",
            reception_rating_condition: "",
            summary: "",
            pk: "",
            Recommendation_promotion :"",
            Recommendation_call_handling :"",
          };
          call.caller_numer = x["caller_number_raw"];
          call.pk =
            x["caller_number_raw"] +
            "|" +
            x["call_date"] +
            "|" +
            x["caller_id"];
          call.category = x["ai_narration"].Category;
          call.media_url = x["media_url"];
          call.mood = x["ai_narration"]["Mood"];
          call.recepitionist_rating = x["ai_narration"]["ReceptionistRating"];
          call.sentiment = x["ai_narration"]["Sentiment"];
          call.narration = x["ai_narration"]["DetailedStudy"];
          call.dept_name = x["department_name"];
          call.isAppointmentRelated = x["ai_narration"]["isAppointmentRelated"];
          call.isOrderRelated = x["ai_narration"]["isOrderRelated"];
          call.reception_rating_condition = x["ai_narration"]["reception_rating_condition"];
          call.Recommendation_promotion = x["ai_narration"]["Recommendation_promotion"];
          call.Recommendation_call_handling = x["ai_narration"]["Recommendation_call_handling"];
          call.duration = x["duration"];
          if (x["ai_narration"]["Summary"]) {
            call.summary = x["ai_narration"]["Summary"];
          } else {
            call.summary = "";
          }
          let dt = x["start_datetime"];
          let ldt = new Date(dt);
          // ldt.setHours(ldt.getHours() + 5);
          // ldt.setMinutes(ldt.getMinutes() + 30);
          call.date_time = ldt;

          this.Items.push(call);
        });

        this.source = this.Items;
        console.log("source is", this.source)
        this.loading = false;
        this.changeDetectorRef.detectChanges();

        console.log("source is fixed");
        // console.log(this.Items);
      },
      (err) => {
        this.loading = false;

        console.log("issue", err.error.message);
      }
    );
  }


  ngOnInit() {

    if (!this.authService.LoginStatus() == true) {
      console.log("Not Authenticated, So Refiecting to Login Screen`");
      this.router.navigateByUrl("/login");
    } else {
      console.log("Authenticated, Refiecting to Call Screen`");
      this.loading = true;
      let dt_call = this.getDateString();

      this.callService.getCart(dt_call).subscribe(
        (result) => {
          console.log(result);
          this.sorted_date = this.sortDates(result);
          console.log("Sorted dates", this.sorted_date);
          // let date = new Date(this.currentDate.getTime() - 1440 * 60 * 1000)

          this.sorted_date.forEach((x: any, i: any) => {
            // console.log(i);
            if (x["ai_narration"] == undefined) {
              return;
            }
            // else if (new Date(x["start_datetime"]) < date) {
            //   console.log("coming date")

            //   return
            // }
            if (x["transcript"] != undefined) {
              if (x["transcript"].length < 150){
                return;
              }
            }
            console.log("transcript", x["transcript"] != undefined)
            if (x["transcript"] != undefined) {
              console.log("transcript length", x["transcript"].length)
              console.log("transcript length",x["transcript"].length < 150)
              // if (x["transcript"].length < 150){
              //   return;
              // }
            }

            //  console.log(x['ai_narration'].Category);
            // console.log(x);
            let call = {
              caller_numer: "",
              category: "",
              mood: "",
              recepitionist_rating: "",
              sentiment: "",
              media_url: "",
              date_time: new Date(),
              dept_name: "",
              duration: "",
              narration: "",
              isAppointmentRelated: "",
              isOrderRelated: "",
              reception_rating_condition: "",
              summary: "",
              pk: "",
              Recommendation_promotion :"",
              Recommendation_call_handling :"",
              transcript:""
            };
            call.transcript = x["transcript"]
            call.caller_numer = x["caller_number_raw"];
            call.pk =
              x["caller_number_raw"] +
              "|" +
              x["call_date"] +
              "|" +
              x["caller_id"];
            call.category = x["ai_narration"].Category;
            call.media_url = x["media_url"];
            call.mood = x["ai_narration"]["Mood"];           

            call.recepitionist_rating = x["ai_narration"]["recepitionist_rating"];
            call.sentiment = x["ai_narration"]["Sentiment"];
            call.narration = x["ai_narration"]["DetailedStudy"];
            call.dept_name = x["department_name"];
            call.isAppointmentRelated =
              x["ai_narration"]["isAppointmentRelated"];
            call.isOrderRelated = x["ai_narration"]["isOrderRelated"];
            call.reception_rating_condition = x["ai_narration"]["reception_rating_condition"];
            call.Recommendation_promotion = x["ai_narration"]["Recommendation_promotion"];
            call.Recommendation_call_handling = x["ai_narration"]["Recommendation_call_handling"];
            call.duration = x["duration"];
            if (x["ai_narration"]["Summary"]) {
              call.summary = x["ai_narration"]["Summary"];
            } else {
              call.summary = "";
            }
            let dt = x["start_datetime"];
            let ldt = new Date(dt);
            // ldt.setHours(ldt.getHours() + 5);
            // ldt.setMinutes(ldt.getMinutes() + 30);
            call.date_time = ldt;
            

            this.Items.push(call);
          });

          this.loading = false;
          console.log(this.Items)
          this.source = this.Items;
          this.changeDetectorRef.detectChanges();


          // console.log(this.Items);
        },
        (err) => {
          this.loading = false;

          console.log("issue", err.error.message);
        }

      );
      let uniqueValues = [new Set(this.source.map((item: any) => item['dept_name']))];
      console.log(uniqueValues)
    }

  }

  getCallsByMood(mood: String) {
    this.loading = true;
    this.Items = [];
    console.log("mood", mood, this.sorted_date)

    this.sorted_date.forEach((x: any, i: any) => {
      if (x["ai_narration"] == undefined) {
        return;
      }
      else if (mood != "All") {
        if (x["ai_narration"]["Mood"] != mood || x["ai_narration"]["Mood"] == undefined) {
          console.log("coming")
          return
        }

      }
      console.log(x["ai_narration"]["Mood"])

      //  console.log(x['ai_narration'].Category);
      // console.log(x);
      let call = {
        caller_numer: "",
        category: "",
        mood: "",
        recepitionist_rating: "",
        sentiment: "",
        media_url: "",
        date_time: new Date(),
        dept_name: "",
        duration: "",
        narration: "",
        isAppointmentRelated: "",
        isOrderRelated: "",
        reception_rating_condition: "",
        summary: "",
        pk: "",
        Recommendation_promotion :"",
        Recommendation_call_handling :"",
      };
      call.caller_numer = x["caller_number_raw"];
      call.pk =
        x["caller_number_raw"] +
        "|" +
        x["call_date"] +
        "|" +
        x["caller_id"];
      call.category = x["ai_narration"].Category;
      call.media_url = x["media_url"];
      call.mood = x["ai_narration"]["Mood"];
      call.recepitionist_rating = x["ai_narration"]["recepitionist_rating"];
      call.sentiment = x["ai_narration"]["Sentiment"];
      call.narration = x["ai_narration"]["DetailedStudy"];
      call.dept_name = x["department_name"];
      call.isAppointmentRelated = x["ai_narration"]["isAppointmentRelated"];
      call.isOrderRelated = x["ai_narration"]["isOrderRelated"];
      call.reception_rating_condition = x["ai_narration"]["reception_rating_condition"];
      call.Recommendation_promotion = x["ai_narration"]["Recommendation_promotion"];
      call.Recommendation_call_handling = x["ai_narration"]["Recommendation_call_handling"];
      call.duration = x["duration"];
      if (x["ai_narration"]["Summary"]) {
        call.summary = x["ai_narration"]["Summary"];
      } else {
        call.summary = "";
      }
      let dt = x["start_datetime"];
      let ldt = new Date(dt);
      // ldt.setHours(ldt.getHours() + 5);
      // ldt.setMinutes(ldt.getMinutes() + 30);
      call.date_time = ldt;

      this.Items.push(call);
    });
    console.log("item pushed")
    this.source = this.Items;
    this.loading = false;
    this.changeDetectorRef.detectChanges();

    console.log("source is fixed");


  }
  getCallsByDate() {
    console.log("clicked");
    this.loading = true;
    this.Items = [];

    const callDate: any = this.fromDate.value;
    const cd = new Date(callDate)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    this.callService.getCart(cd).subscribe(
      (result) => {
        console.log('now --', result);
        this.sorted_date = this.sortDates(result);

        this.sorted_date.forEach((x: any, i: any) => {
          // console.log(i);
          if (x["ai_narration"] == undefined) {
            return;
          }
          if (x["transcript"] != undefined) {
            if (x["transcript"].length < 150){
              return;
            }
          }

          //  console.log(x['ai_narration'].Category);
          // console.log(x);
          let call = {
            caller_numer: "",
            category: "",
            mood: "",
            recepitionist_rating: "",
            sentiment: "",
            media_url: "",
            date_time: new Date(),
            dept_name: "",
            duration: "",
            narration: "",
            isAppointmentRelated: "",
            isOrderRelated: "",
            reception_rating_condition: "",
            summary: "",
            pk: "",
            Recommendation_promotion :"",
            Recommendation_call_handling :"",
          };
          call.caller_numer = x["caller_number_raw"];
          call.pk =
            x["caller_number_raw"] +
            "|" +
            x["call_date"] +
            "|" +
            x["caller_id"];
          call.category = x["ai_narration"].Category;
          call.media_url = x["media_url"];
          call.mood = x["ai_narration"]["Mood"];
          call.recepitionist_rating = x["ai_narration"]["recepitionist_rating"];
          call.sentiment = x["ai_narration"]["Sentiment"];
          call.narration = x["ai_narration"]["DetailedStudy"];
          call.dept_name = x["department_name"];
          call.isAppointmentRelated = x["ai_narration"]["isAppointmentRelated"];
          call.isOrderRelated = x["ai_narration"]["isOrderRelated"];
          call.reception_rating_condition = x["ai_narration"]["reception_rating_condition"];
          call.Recommendation_promotion = x["ai_narration"]["Recommendation_promotion"];
          call.Recommendation_call_handling = x["ai_narration"]["Recommendation_call_handling"];
          call.duration = x["duration"];
          if (x["ai_narration"]["Summary"]) {
            call.summary = x["ai_narration"]["Summary"];
          } else {
            call.summary = "";
          }

          
          

          let dt = x["start_datetime"];
          let ldt = new Date(dt);
          // ldt.setHours(ldt.getHours() + 5);
          // ldt.setMinutes(ldt.getMinutes() + 30);
          call.date_time = ldt;

          this.Items.push(call);
        });

        this.source = this.Items;
        this.loading = false;
        this.changeDetectorRef.detectChanges();

        console.log("source is fixed");
        // console.log(this.Items);
      },
      (err) => {
        this.loading = false;

        console.log("issue", err.error.message);
      }
    );
  }


filterSentiments(sentiment: string){

  this.loading=true;
  this.Items=[]
 

    this.sorted_date.forEach((x: any, i: any) => {

      // console.log(i);
      if (x["ai_narration"] == undefined) {
        return;
      }
      else {
        // console.log(x["ai_narration"]['Sentiment'])
        let statement = x["ai_narration"]['Sentiment']
        console.log("sta",sentiment)
        console.log("sta",sentiment)
        console.log("sta",statement.includes(sentiment))
        if (sentiment.toLocaleLowerCase()=='all' ||statement.includes(sentiment) ){

          console.log(x["ai_narration"]['Sentiment'])
          let call = {
            caller_numer: "",
            category: "",
            mood: "",
            recepitionist_rating: "",
            sentiment: "",
            media_url: "",
            date_time: new Date(),
            dept_name: "",
            duration: "",
            narration: "",
            isAppointmentRelated: "",
            isOrderRelated: "",
            reception_rating_condition: "",
            summary: "",
            pk: "",
            Recommendation_promotion :"",
            Recommendation_call_handling :"",
          };
          call.caller_numer = x["caller_number_raw"];
          call.pk =
            x["caller_number_raw"] +
            "|" +
            x["call_date"] +
            "|" +
            x["caller_id"];
          call.category = x["ai_narration"].Category;
          call.media_url = x["media_url"];
          call.mood = x["ai_narration"]["Mood"];
          call.recepitionist_rating = x["ai_narration"]["recepitionist_rating"];
          call.sentiment = x["ai_narration"]["Sentiment"];
          call.narration = x["ai_narration"]["DetailedStudy"];
          call.dept_name = x["department_name"];
          call.isAppointmentRelated = x["ai_narration"]["isAppointmentRelated"];
          call.isOrderRelated = x["ai_narration"]["isOrderRelated"];
          call.reception_rating_condition = x["ai_narration"]["reception_rating_condition"];
          call.Recommendation_promotion = x["ai_narration"]["Recommendation_promotion"];
          call.Recommendation_call_handling = x["ai_narration"]["Recommendation_call_handling"];
          call.duration = x["duration"];
          if (x["ai_narration"]["Summary"]) {
            call.summary = x["ai_narration"]["Summary"];
          } else {
            call.summary = "";
          }
          let dt = x["start_datetime"];
          let ldt = new Date(dt);
          // ldt.setHours(ldt.getHours() + 5);
          // ldt.setMinutes(ldt.getMinutes() + 30);
          call.date_time = ldt;
    
          this.Items.push(call);}
          else{
            return
          }
      }

      //  console.log(x['ai_narration'].Category);
      // console.log(x);
     
    });



  this.source = this.Items;
  this.loading = false;
  this.changeDetectorRef.detectChanges();

  console.log("source is fixed");
  
  

}

filterRating(rating: string){
  this.loading=true;
  this.Items=[]

    this.sorted_date.forEach((x: any, i: any) => {

      // console.log(i);
      if (x["ai_narration"] == undefined) {
        return;
      }
      else {
        // console.log(x["ai_narration"]['Sentiment'])
        if (rating.toLocaleLowerCase()=='all' ||x["ai_narration"]['recepitionist_rating'].includes(rating) ){

          console.log(x["ai_narration"]['Sentiment'])
          let call = {
            caller_numer: "",
            category: "",
            mood: "",
            recepitionist_rating: "",
            sentiment: "",
            media_url: "",
            date_time: new Date(),
            dept_name: "",
            duration: "",
            narration: "",
            isAppointmentRelated: "",
            isOrderRelated: "",
            reception_rating_condition: "",
            summary: "",
            pk: "",
            Recommendation_promotion :"",
            Recommendation_call_handling :"",
          };
          call.caller_numer = x["caller_number_raw"];
          call.pk =
            x["caller_number_raw"] +
            "|" +
            x["call_date"] +
            "|" +
            x["caller_id"];
          call.category = x["ai_narration"].Category;
          call.media_url = x["media_url"];
          call.mood = x["ai_narration"]["Mood"];
          call.recepitionist_rating = x["ai_narration"]["recepitionist_rating"];
          call.sentiment = x["ai_narration"]["Sentiment"];
          call.narration = x["ai_narration"]["DetailedStudy"];
          call.dept_name = x["department_name"];
          call.isAppointmentRelated = x["ai_narration"]["isAppointmentRelated"];
          call.isOrderRelated = x["ai_narration"]["isOrderRelated"];
          call.reception_rating_condition = x["ai_narration"]["reception_rating_condition"];
          call.Recommendation_promotion = x["ai_narration"]["Recommendation_promotion"];
          call.Recommendation_call_handling = x["ai_narration"]["Recommendation_call_handling"];
          call.duration = x["duration"];
          if (x["ai_narration"]["Summary"]) {
            call.summary = x["ai_narration"]["Summary"];
          } else {
            call.summary = "";
          }
          let dt = x["start_datetime"];
          let ldt = new Date(dt);
          // ldt.setHours(ldt.getHours() + 5);
          // ldt.setMinutes(ldt.getMinutes() + 30);
          call.date_time = ldt;
    
          this.Items.push(call);}
          else{
            return
          }
      }

      //  console.log(x['ai_narration'].Category);
      // console.log(x);
     
    });



  this.source = this.Items;
  // this.sentiments=[]
  // this.source.forEach(res=>{
  //   if (!this.sentiments.includes(res.sentiment)){
  //     this.sentiments.push(res.sentiment)}
  // })
  this.loading = false;
  this.changeDetectorRef.detectChanges();

  console.log("source is fixed");
  
  

}



filterdepartment(event: any){

  const filterValue = event;
  const regex1= /(\b\w+\b)$/;

const match = filterValue.match(regex1);
  console.log("hi",filterValue)
  console.log("hiii",this.sorted_date)
  this.loading=true;
  this.Items=[]
  const regex = new RegExp('\\b' + match + '\\b', 'i');

    this.sorted_date.forEach((x: any) => {
      if (x["ai_narration"] === undefined) {
        return;
      } else {
        let dept_name = x["department_name"];
        if (filterValue === 'All' || dept_name.includes(filterValue)) {
          let call = {
            caller_numer: x["caller_number_raw"],
            pk: x["caller_number_raw"] + "|" + x["call_date"] + "|" + x["caller_id"],
            category: x["ai_narration"].Category,
            media_url: x["media_url"],
            mood: x["ai_narration"]["Mood"],
            recepitionist_rating: x["ai_narration"]["recepitionist_rating"],
            sentiment: x["ai_narration"]["Sentiment"],
            narration: x["ai_narration"]["DetailedStudy"],
            dept_name: x["department_name"],
            isAppointmentRelated: x["ai_narration"]["isAppointmentRelated"],
            isOrderRelated: x["ai_narration"]["isOrderRelated"],
            reception_rating_condition: x["ai_narration"]["reception_rating_condition"],
            Recommendation_promotion: x["ai_narration"]["Recommendation_promotion"],
            Recommendation_call_handling: x["ai_narration"]["Recommendation_call_handling"],
            duration: x["duration"],
            summary: x["ai_narration"]["Summary"] ? x["ai_narration"]["Summary"] : "",
            date_time: new Date(x["start_datetime"])
          };
          this.Items.push(call);
        }
      }
    });
  
    this.source = this.Items;
    this.loading = false;
    this.changeDetectorRef.detectChanges();
  }
  



  searching: GuiSearching = {
    enabled: true,
    placeholder: "Search Phone Number",
  };

  paging: GuiPaging = {
    enabled: true,
    page: 1,
    pageSize: 10,
    pageSizes: [10, 25, 50],
    pagerTop: true,
    pagerBottom: true,
    display: GuiPagingDisplay.BASIC,
  };

  titlePanel: GuiTitlePanel = {
    enabled: true,
    template: () => {
      return `
			<div class='title-panel-example' style="font-weight:bold" >List of Call Center Calls</div>
			`;
    },
  };

  footerPanel: GuiFooterPanel = {
    enabled: true,
    template: () => {
      return `
	 		<div class='footer-panel-example'>Copyright © 2024-2025 SetNext.io</div>
			`;
    },
  };

  infoPanel: GuiInfoPanel = {
    enabled: true,
    infoDialog: false,
    columnsManager: true,
  };

  columnMenu: GuiColumnMenu = {
    enabled: true,
  };
  sorting: GuiSorting = {
    enabled: true,
    multiSorting: true,
  };
  columns: Array<GuiColumn> = [
    {
      header: "Phone",
      field: "caller_numer",
    },
    {
      header: "Date Time",
      field: "date_time",
      formatter: (v: Date) => v.toLocaleString(),
      sorting: false,
      width:200
    },
    {
      header: "Department",
      field: "dept_name",
    },
    {
      header: "Category",
      field: "category",
      view: GuiCellView.CHIP,
    },
    {
      header: "Mood",
      field: "mood",
      view: (value: any) => {
        if (value == "Sad") {
          return `<div style="color: red;font-weight: bold"><span style='display:inline-block;min-width:60px'>${value}</span> <span><img src='assets/img/sad-face.webp' style='max-width:30px'></span></div>`;
        } else if (value == "Happy") {
          return `<div style="color: green;font-weight: bold;font-style:italic"><span style='display:inline-block;min-width:60px'>${value}</span> <span><img src='assets/img/smile.webp' style='max-width:30px'></span></div>`;
        } else if (value == "Anxious") {
          return `<div style="color: green;font-weight: bold;font-style:italic"><span style='display:inline-block;min-width:60px'>${value}</span> <span><img src='assets/img/anxious.webp' style='max-width:30px'></span></div>`;
        } else if (value == "Angry") {
          return `<div style="color: green;font-weight: bold;font-style:italic"><span style='display:inline-block;min-width:60px'>${value}</span> <span><img src='assets/img/angry.webp' style='max-width:30px'></span></div>`;
        } else {
          return `<div style="color: grey"><span style='display:inline-block;min-width:60px'>${value}</span> <span><img src='assets/img/neutral-face.webp' style='max-width:30px'></span></div>`;
        }
      },
    },
    {
      header: "Sentiment",
      field: "sentiment",
      width: 250,
    },
    {
      header: "Rating",
      field: "recepitionist_rating",
      view: (value: any) => {
        if (value == "Poor") {
          return `<div style="color: red;font-weight: bold"><span style='display:inline-block;min-width:60px'>${value}</span> <span><img src='assets/img/poor.webp' style='max-width:30px'></span></div>`;
        } else if (value == "Good") {
          return `<div style="color: green;font-weight: bold;font-style:italic"><span style='display:inline-block;min-width:60px'>${value}</span> <span><img src='assets/img/good.webp' style='max-width:30px'></span></div>`;
        } else {
          return `<div style="color: grey"><span style='display:inline-block;min-width:60px'>${value}</span> <span><img src='assets/img/ok.webp' style='max-width:30px'></span></div>`;
        }
      },
    },
    {
      header: "Audio",
      field: "media_url",
      view: (value: string) => {
        return `<audio controls><source src=${value} type="audio/mpeg"></audio>`;
      },
      width: 275,
    },
    {
      header: "Analysis",
      field: "pk",
      view: (value: string) => {
        return `<ng-template let-item="item">
			<a href="http://localhost:4200/mi?id=${value}" [routerLink]="['today']" class="btn btn-summary"">Examine</a>
		</ng-template>`;
      },
    },
  ];

  rowDetail: GuiRowDetail = {
    enabled: true,
    template: (item) => {
      return `
      
			<div class='user-detail'>
      <div style="align:left">
      <a href="http://localhost:4200/mi?id=${item.pk}"  class="btn btn-primary"">Examine</a>
      </div>

      

				<div><b>Phone:</b>${item.caller_numer}
	
      
	
				<span><b>Division:</b>${item.dept_name}</span>
				<span><b>Category:</b>${item.category}</span></div>
				<div><b>AI Narration:</b><p> ${item.narration}</p></div>
        <div><b>Summary:</b><p> ${item.summary}</p></div>
        <div><b>Caller Sentiment:</b><p> ${item.sentiment}</p></div>
        <div><b>Is the Call Appointment Related:</b><p> ${item.isAppointmentRelated}</p></div>
        <div><b>Is the Call Order Related:</b><p> ${item.isOrderRelated}</p></div>
        <div><b>Mood of the Caller:</b><p> ${item.mood}</p></div>
        <div><b>ReceptionistRating:</b><p> ${item.recepitionist_rating}</p></div>
        <div><b>Recommendation:</b><p> ${item.Recommendation}</p></div>
        <div><b>ReceptionistRating:</b><p> ${item.recepitionist_rating}</p></div>
        <div><b>Recommendation for receptionist handling calls:</b><p> ${item.Recommendation_call_handling}</p></div>
        <div><b>Recommendation for receptionist giving promotions of services:</b><p> ${item.Recommendation_promotion}</p></div>
  
        <div><button class='btn btn-success me-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots" viewBox="0 0 16 16">
  <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
  <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9 9 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.4 10.4 0 0 1-.524 2.318l-.003.011a11 11 0 0 1-.244.637c-.079.186.074.394.273.362a22 22 0 0 0 .693-.125m.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6-3.004 6-7 6a8 8 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a11 11 0 0 0 .398-2"/>
</svg><span class="ms-1">Chat With Me</span></button>
        <button class='btn btn-primary me-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightbulb" viewBox="0 0 16 16">
  <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>
</svg><span class="ms-1">Suggest Me</span></button>
        <button class='btn btn-danger me-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-diamond" viewBox="0 0 16 16">
  <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
</svg><span class="ms-1">Escalate</span></button>
        <button class='btn btn-primary me-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-day" viewBox="0 0 16 16">
  <path d="M4.684 11.523v-2.3h2.261v-.61H4.684V6.801h2.464v-.61H4v5.332zm3.296 0h.676V8.98c0-.554.227-1.007.953-1.007.125 0 .258.004.329.015v-.613a2 2 0 0 0-.254-.02c-.582 0-.891.32-1.012.567h-.02v-.504H7.98zm2.805-5.093c0 .238.192.425.43.425a.428.428 0 1 0 0-.855.426.426 0 0 0-.43.43m.094 5.093h.672V7.418h-.672z"/>
  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
</svg><span class="mx-1">Appointment</span></button>
        <button class='btn btn-primary me-2'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
</svg><span class="ms-1">Fetch History</span></button>
        <button class='btn btn-primary me-2'><span class="ms-1">Contact Doctor</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
</svg></button>
<button (click)="testclick()" class='btn btn-primary me-2'><span class="ms-1">Contact Caller</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
</svg></button>

        </div>
        
			</div>`;
    },
  };

  convertUTCDateToLocalDate(date: Date) {
    var newDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    );
    console.log(newDate);
    return newDate;
  }

  
}