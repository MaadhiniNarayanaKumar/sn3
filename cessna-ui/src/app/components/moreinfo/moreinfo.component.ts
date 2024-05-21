import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CallService } from '../../services/call.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-moreinfo',
  templateUrl: './moreinfo.component.html',
  styleUrl: './moreinfo.component.css'
})
export class MoreinfoComponent implements OnInit{
  phone_number = ""
  partition_key = ""
  sort_key = ""
  id = ""
  history:[]=[];
// chatMessages: any;

  constructor(private router:ActivatedRoute, private callsvc: CallService,private arouter:Router){}
  ngOnInit(): void {
    console.log("loading again")
    this.id= this.router.snapshot.queryParams["id"]
    
     


      console.log("ph:",this.phone_number,"partition_key:",this.partition_key,"sort_key:",this.sort_key)
  }
    
 

  navigateTochat() {
    this.arouter.navigate(['/chatui'],{queryParams:{ph:this.phone_number}});
  }
}
