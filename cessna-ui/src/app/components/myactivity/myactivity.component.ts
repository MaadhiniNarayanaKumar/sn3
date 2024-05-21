import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef  } from '@angular/core';
import { PatienthistoryComponent } from '../patienthistory/patienthistory.component';

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
import { ActivatedRoute } from '@angular/router';
import { myactivityService } from '../../services/myactivity.service';
import { FormControl } from '@angular/forms';
import { formatDate } from "@angular/common";
import { CallService } from '../../services/call.service';
import { PatienthistoryService } from '../../services/patienthistory.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-myactivity',
  templateUrl: './myactivity.component.html',
  styleUrl: './myactivity.component.css'
})
export class myactivityComponent implements OnInit {
  @ViewChild('messageInput')
  messageInput!: ElementRef;
  source: Array<any> = [];
  theme = "Material";
  isCollapsed = true;
  rowColoring = GuiRowColoring.EVEN;
  isLoading = false;
  loading: boolean = false;
  actor_id = ""
  role = ""
  patient_id: string = 'patient_id';
  history_data: [] = [];
  user_data : any = {}
  partition_key = ""
  sort_key = ""
 
  Items: any = [];
fromDate = new FormControl(formatDate(new Date(), "dd-MM-yyyy", "en"));
todate = new Date ().toLocaleDateString();
dropdownItems: string[] = ['Item 1', 'Item 2', 'Item 3'];
isDropdownOpen: boolean = false;


subjects: any[] = [
  "All",
  "Onboarding",
  "Appointment",
  "Screening",
  "Dianosis Centre",
  "Others - Second Opinion",
  "Testing"
];

toggleDropdown(event: MouseEvent) {
  this.isDropdownOpen = !this.isDropdownOpen;
  event.stopPropagation();
}



  constructor(private patienthistorysvc:PatienthistoryService ,private myactivityService:myactivityService, private route: ActivatedRoute,private authService: AuthService,  private changeDetectorRef: ChangeDetectorRef) {
    console.log("component coming")
  }
  ngOnInit(): void {
    console.log("hi there")
    this.user_data = this.authService.getUserData()
    this.actor_id = this.user_data['phoneno']
    this.role = this.user_data.principle["functional_role"]
    
    console.log("ai",this.actor_id)
    this.myactivityService.getactorhistory(this.role,this.actor_id).subscribe((result) => {
      console.log("before myactivity comes")
      this.history_data = result;
      this.source = this.history_data
      console.log("after myactivity comes")
      console.log("hi",this.history_data)
    },
    (err) => {
      this.loading = false;

      console.log("issue", err.error.message);
    }
  )
  }

  formattime(time : string){
    // console.log("format")
    let new_time=time.replace(/[-:./ ]/g, '')
    return new_time

  }
  formatdate(time1 :string){
    const dateString = time1;
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formattedDate // Output: 04/24/2024, 10:09:26 AM

    
  }



  // getactorhistory(actor_id: string) {

  //   console.log("actor number is ", actor_id)
  //   return this.myactivityService.getactorhistory(actor_id).subscribe((res: any) => {
  //     this.history_data = res;

  //     console.log(this.history_data)
  //     console.log(res)
  //   })
  // }
  
  getCallsByDate() {
    console.log("clicked");
    this.loading = true;
    this.Items = [];
  }
  
  customFilter(arr: any[], match :string) {
    
    return arr.filter(obj => {
      console.log("sub",obj['subject'],match[0].toLocaleLowerCase())
        if ((match[0] === 'All'||obj['subject'].toLocaleLowerCase()==match[0].toLocaleLowerCase())) {
          console.log("coming")
            // If the condition is met, keep the object
            return this.Items.push(obj)
        } else {
            // If the condition is not met, exclude the object
            return ;
        }
    });
}
  
  filtersubject(event: any) {
    console.log("entering filtersubject", event);
    const filterValue = event;
    if (!filterValue || !this.history_data || !Array.isArray(this.history_data)) {
        console.error('Invalid input or history_data is not initialized properly.');
        return;
    }

    const regex1 = /(\b\w+\b)$/;
    const match = filterValue.match(regex1);
    if (!match) {
        console.error('No match found in filterValue.');
        return;
    }
    console.log("match", match);

    this.loading = true;
    this.Items = [];
    console.log(filterValue)
    console.log(this.history_data);
    console.log("cfgh",this.customFilter(this.history_data,match))
    this.loading = false;
    console.log(this.Items);
    this.source = this.customFilter(this.history_data,match);
    this.changeDetectorRef.detectChanges();


    // this.history_data.forEach((x: any) => {
    //     const statement = x['subject'];
    //     console.log("statement is", statement);
    //     console.log("match", match);
    //     if (statement && (match[0] === 'All' || statement.toLowerCase().includes(match[0].toLowerCase()))) {
    //         console.log("after subject");
    //         const call = {
    //             caller_number: x["phoneno"],
    //             address: x["address"],
    //             city: x["city"],
    //             functional_role: x["functional_role"],
    //             email: x["email"],
    //             subject: x["subject"],
    //             pet_name: "",
    //             pet_number: "",
    //             pk: ""
    //         };

    //         if (x["pet_details"]) {
    //             x["pet_details"].forEach((pet: { [x: string]: string; }) => {
    //                 const callCopy = { ...call }; 
    //                 callCopy.pet_name = pet["petName"];
    //                 callCopy.pet_number = pet["number"];
    //                 callCopy.pk = x['phoneno'] + "|" + pet["number"];
    //                 this.Items.push(callCopy);
    //             });
    //         } else {
    //             this.Items.push(call);
    //         }
    //     }
    // });

    // this.loading = false;
    // // console.log(this.Items);
    // this.source = this.Items;
    // this.changeDetectorRef.detectChanges();
}

getdates(){
  console.log("is",this.fromDate,this.todate) 
  const fromiso=this.formatISO(String(this.fromDate))
  const toiso=this.formatISO(String(this.todate))
  console.log(fromiso,toiso)
  this.myactivityService.getrecordhistory(this.actor_id,fromiso,toiso).subscribe((res:any)=>{
    this.history_data = res;
    this.source=this.history_data

    console.log(this.history_data)

  })


}

  formatISO(date:string){
    const normalDate = new Date(date);
    const isoDateString = normalDate.toISOString();
    return isoDateString
  }

 
}








