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
  call_promo_keys:string[]=[]
  display_rating = false
  
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
    console.log('this.phone_number -- ',this.phone_number)
    this.get_details(this.phone_number)

  }
  
  get_details(id:string){
    console.log("id is ",id)
    return this.callsvc.get_call_details(this.partition_key,this.sort_key).subscribe((res:any)=>{
      console.log("Result Came",res)
      this.history_data = res;    

      this.call_handling_keys = Object.keys(res[0]['ai_narration']['reception_rating_condition'])
      console.log("call_handling_keys : ",typeof(this.call_handling_keys)) 

      this.call_promo_keys = Object.keys(res[0]['ai_narration']['ReceptionistGivingPromotion'])
      console.log("call_promo_keys : ", this.call_promo_keys)
      
      console.log('promo : ', res[0]['ai_narration']['rating_value_promo'])

      if (res[0]['ai_narration']['rating_value_promo'] != ""){
        this.display_rating = true
      }
    })
  }

}