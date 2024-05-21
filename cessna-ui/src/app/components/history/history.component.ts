import { Component, OnInit } from '@angular/core';
import { CallService } from '../../services/call.service';
import { MoreinfoComponent } from '../moreinfo/moreinfo.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
  id = ""
  

currentPage: any;
  constructor(private callsvc:CallService, private route:ActivatedRoute, private router:Router){}
  ngOnInit(): void {
    

  this.route.queryParams.subscribe(i=>{

     this.id= this.route.snapshot.queryParams["id"]

     // let id = qp['id']  
     let splitstring = this.id.split('|')
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

      console.log('history data : ',this.history_data)

      // console.log(res) 
    })
  }

  moredetails(item:any){
    console.log('item  : ', item)
    const id = item["caller_number_raw"] +
            "|" +
            item["call_date"] +
            "|" +
            item["caller_id"];
    console.log('clicked and id is : ', id)
    // this.router.navigateByUrl('/mi')
    this.router.navigate(['/mi'],{queryParams:{id:id}});
    
  }
}