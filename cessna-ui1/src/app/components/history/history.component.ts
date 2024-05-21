import { Component, OnInit } from '@angular/core';
import { CallService } from '../../services/call.service';
import { MoreinfoComponent } from '../moreinfo/moreinfo.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit  {
  history_data :[] =[];
  phone_number = ""
  partition_key = ""
  sort_key = ""
  

currentPage: any;
  constructor(private callsvc:CallService, private route:ActivatedRoute){}
  ngOnInit(): void {
    

  this.route.queryParams.subscribe(i=>{

    let id= this.route.snapshot.queryParams["id"]

     // let id = qp['id']  
     let splitstring = id.split('|')
     this.phone_number = splitstring[0]
     this.partition_key = splitstring[1]
     this.sort_key = splitstring[2]

    console.log("PK: ", this.partition_key)
    console.log("SK: ", this.sort_key)



    // this.phone_number = i['ph']
    console.log(this.phone_number)
    this.fetch_history(this.phone_number)
  })
  
  }
  fetch_history(phone_number:string){
    console.log("phone number is ",phone_number)
    return this.callsvc.gethistory(phone_number).subscribe((res:any)=>{
      this.history_data = res;

      console.log(this.history_data

        
      )

      console.log(res) 
    })
  }

}