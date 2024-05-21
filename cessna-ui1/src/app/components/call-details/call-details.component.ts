import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallService } from '../../services/call.service';


@Component({
  selector: 'app-call-details',
  templateUrl: './call-details.component.html',
  styleUrl: './call-details.component.css'
})
export class CallDetailsComponent implements OnInit {

  constructor(private callsvc:CallService, private route:ActivatedRoute){}
  partition_key = ""
  sort_key = ""
  phone_number =""
  neg_rating=0
  pos_rating=0
  history_data :[] =[];
  rating = ""
  call_handling_keys:string[] = []
  
  ngOnInit(): void {
    let id= this.route.snapshot.queryParams["id"]

     // let id = qp['id']  
     let splitstring = id.split('|')
     this.phone_number = splitstring[0]
     this.partition_key = splitstring[1]
     this.sort_key = splitstring[2]

    console.log("PK: ", this.partition_key)
    console.log("SK: ", this.sort_key)
    
    let id_new = this.phone_number+this.partition_key+this.sort_key
    console.log('New id -- ',id_new)
    this.get_details(this.phone_number)

  }
  
  get_details(id:string){
    console.log("id is ",id)
    return this.callsvc.get_call_details(this.partition_key,this.sort_key).subscribe((res:any)=>{
      console.log("Result Came",res)
        this.history_data = res;

      
      console.log(' history_data keys: ', res[0]['ai_narration'])
      console.log('******history_data : ', this.history_data)
      this.call_handling_keys = Object.keys(res[0]['ai_narration']["ReceptionRating"])
      console.log('agaxyuasg', typeof Object.keys(res[0]['ai_narration']["ReceptionRating"]))

      console.log('here : ',res[0]['ai_narration']['ReceptionRating'])
      let x = res[0]['ai_narration']
      if (x && x["ReceptionRating"] && typeof x["ReceptionRating"] == 'object') {
        let tot = Object.keys(x["ReceptionRating"]).length;
        console.log('total : ', tot)
        let pos = 0;
        let neg = 0;
        let minus_tot = 0
        Object.keys(x["ReceptionRating"]).forEach((i) => {
          if (x["ReceptionRating"][i] === 'NA' || x["ReceptionRating"][i] === 'N/A'){
            minus_tot++
          }
          if (x["ReceptionRating"][i] === 'yes' || x["ReceptionRating"][i] === "yes") {
                pos++;
            } else {
                neg++;
            }
              
           })
    
      this.neg_rating = (Math.round((neg / (tot-minus_tot)) * 100))
      this.pos_rating = (Math.round((pos / (tot-minus_tot)) * 100))
      console.log('negative qualities : ', this.neg_rating)
      console.log('positive qualities : ', this.pos_rating)

      if (this.pos_rating>60){
        this.rating = "Good"
      }
      else if (this.pos_rating < 40){
        this.rating = "Poor"
      }
      else {this.rating = "Normal"}
    } 
    })
  }

}
