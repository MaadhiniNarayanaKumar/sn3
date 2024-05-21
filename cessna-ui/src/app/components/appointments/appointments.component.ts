import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CallService } from "../../services/call.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { formatDate, JsonPipe } from "@angular/common";
import { NgbTimepickerModule, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import { formatISO } from "date-fns";
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
import { AppointmentsService } from "../../services/appointments.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  styleUrl: "./appointments.component.css",
})
export class AppointmentsComponent implements OnInit {
  filtersButtonText = "Filters";
  rowColoring = GuiRowColoring.EVEN;
  isCollapsed = true;
  isLoading = false;
  loading: boolean = false;
  theme = "Material";
  source: Array<any> = [];
  Items: any = [];
  previous_data: any = [];
  sorted_date: any = [];

  appointment_data = [];
  phoneno = "";
  user_data: any = {};
  role = "";
  cd = "";
  not_patient = false;
  receptionist = false;
  show_whole_appointments = false;
  fromDate = new FormControl(formatDate(new Date(), "dd-MM-yyyy", "en"));
  time = { hour: 13, minute: 30 };
  meridian = true;
  selectedTime: FormControl = new FormControl("11:11 AM");
  departments: any[] = ["Cardiology", "Pathology"];
  selectedDepartment = new FormControl();
  selectedAppointment = new FormControl();

  pets: any[] = ["Cat", "Dog", "Horse"];
  selectedPet = new FormControl();

  constructor(
    private appointsvc: AppointmentsService,
    private route: Router,
    private aroute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.LoginStatus() == true) {
      console.log("Not Authenticated, So Refiecting to Login Screen`");
      this.route.navigateByUrl("/login");
    } else {
      console.log("Authenticated, Refiecting to Call Screen`");
      this.loading = true;

      this.user_data = this.authService.getUserData();
      this.role = this.user_data.principle["functional_role"];
      console.log("role : --- , ", this.role);
      if (this.role != "Patient") {
        console.log("role is not patient");
        this.not_patient = true;
      }
      this.phoneno = this.user_data["phoneno"];
      this.appointsvc.get_appoint(this.cd, this.phoneno, this.role).subscribe(
        (res: any) => {
          this.appointment_data = res;
          console.log("got the data from the dynamo", res);
          // console.log('summary  : ', res[0]['ai_narration']['Summary'])
          this.appointment_data.forEach((x: any, i: any) => {
            let call = {
              caller_number: "",
              Pet_type: "",
              Dept_name: "",
              selectedDate: "",
              selectedSlot: "",
              AppointmentStatus: "",
              Recording: "",
              DetailedStudy: "",
            };

            call.caller_number = x["phoneno"];
            call.Pet_type = x["selectPet"][0]["pet_details"]["petType"];
            call.Dept_name = x["Dept_name"];
            call.selectedDate = x["selectedDate"];
            call.selectedSlot = x["selectedSlot"];
            call.AppointmentStatus = x["AppointmentStatus"];
            call.Recording = x["Recording"];
            if (x["description"]) {
              call.DetailedStudy = x["description"];
            }

            // call.DetailedStudy = x["ai_narration"]['DetailedStudy']

            this.Items.push(call);
            console.log("items : ", this.Items);
          });
          this.loading = false;
          console.log(this.Items);
          this.source = this.Items;
          this.changeDetectorRef.detectChanges();
        },
        (err) => {
          this.loading = false;

          console.log("issue", err.error.message);
        }
      );
    }
  }

  get_appointment(phone_number: string) {
    this.show_whole_appointments = false;
    console.log(
      "show_whole_appointments after my appointments : ",
      this.show_whole_appointments
    );
    console.log("phone number is ", phone_number);
    console.log("the role is  : ", this.role);
    const callDate: any = this.fromDate.value;
    console.log("selected date :", callDate);
    const cd = new Date(callDate)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
    return this.appointsvc
      .get_appoint(cd, phone_number, this.role)
      .subscribe((res: any) => {
        this.appointment_data = res;
        this.Items = [];
        console.log("got the data from the dynamo", res);
        this.appointment_data.forEach((x: any, i: any) => {
          let call = {
            caller_number: "",
            Pet_type: "",
            Dept_name: "",
            selectedDate: "",
            selectedSlot: "",
            AppointmentStatus: "",
            Recording: "",
            DetailedStudy: "",
          };

          call.caller_number = x["phoneno"];
          call.Pet_type = x["selectPet"][0]["pet_details"]["petType"];
          call.Dept_name = x["Dept_name"];
          call.selectedDate = x["selectedDate"];
          call.selectedSlot = x["selectedSlot"];
          call.AppointmentStatus = x["AppointmentStatus"];
          call.Recording = x["Recording"];
          if (x["description"]) {
            call.DetailedStudy = x["description"];
          }

          this.Items.push(call);
          console.log("items : ", this.Items);
        });
        this.loading = false;
        console.log(this.Items);
        this.source = this.Items;
        this.changeDetectorRef.detectChanges();
        console.log("changeDetectorRef : ", this.changeDetectorRef);
        this.updateTitlePanel();
      });
  }

  getbyDate1() {
    const callDate: any = this.fromDate.value;
    console.log("selected date :", callDate);
    const cd = new Date(callDate)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");
    this.previous_data = this.Items;
    this.Items = [];
    this.appointment_data.forEach((x: any, i: any) => {
      let call = {
        caller_number: "",
        Pet_type: "",
        Dept_name: "",
        selectedDate: "",
        selectedSlot: "",
        AppointmentStatus: "",
        Recording: "",
        DetailedStudy: "",
      };

      call.caller_number = x["phoneno"];
      call.Pet_type = x["selectPet"][0]["pet_details"]["petType"];
      call.Dept_name = x["Dept_name"];
      call.selectedDate = x["selectedDate"];
      call.selectedSlot = x["selectedSlot"];
      call.AppointmentStatus = x["AppointmentStatus"];
      call.Recording = x["Recording"];
      if (x["description"]) {
        call.DetailedStudy = x["description"];
      }

      let selected_date = new Date(call.selectedDate);
      let call_date = new Date(callDate);
      console.log("call.selectedDate : ", call.selectedDate);
      console.log("callDate : ", callDate);
      console.log("new call.selectedDate : ", selected_date);
      console.log("new callDate : ", call_date);
      // if (selected_date===call_date){
      if (call.selectedDate === callDate) {
        console.log("matched the dates");

        this.Items.push(call);
        console.log("items : ", this.Items);
      }
    });
    this.loading = false;
    console.log(this.Items);
    this.source = this.Items;
    this.changeDetectorRef.detectChanges();
  }

  getbyDate(phone_no: string) {
    console.log("going to pick data by date");
    const callDate: any = this.fromDate.value;
    console.log("selected date :", callDate);
    console.log("selected ph :", phone_no);
    const cd = new Date(callDate)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

    return this.appointsvc
      .getAppointmentsbyDate(cd, phone_no)
      .subscribe((result) => {
        console.log("result from appointments by date --", result);
        this.appointment_data = result;
        this.Items = [];
        this.appointment_data.forEach((x: any, i: any) => {
          let call = {
            caller_number: "",
            Pet_type: "",
            Dept_name: "",
            selectedDate: "",
            selectedSlot: "",
            AppointmentStatus: "",
            Recording: "",
            Summary: "",
            DetailedStudy: "",
          };

          call.caller_number = x["phoneno"];
          call.Pet_type = x["Pet_type"];
          call.Dept_name = x["Dept_name"];
          call.selectedDate = x["selectedDate"];
          call.selectedSlot = x["selectedSlot"];
          call.AppointmentStatus = x["AppointmentStatus"];
          call.Recording = x["Recording"];
          call.Summary = x["ai_narration"]["Summary"];
          call.DetailedStudy = x["description"];

          this.Items.push(call);
          console.log("items : ", this.Items);
        });
        this.loading = false;
        console.log(this.Items);
        this.source = this.Items;
        this.changeDetectorRef.detectChanges();
      });
  }

  removeDate1() {
    console.log("clicked remove date");
    this.loading = false;
    console.log(this.previous_data);
    this.source = this.previous_data;
    this.changeDetectorRef.detectChanges();
  }

  removeTime1() {
    console.log("clicked remove time");
    this.loading = false;
    console.log(this.previous_data);
    this.source = this.previous_data;
    this.changeDetectorRef.detectChanges();
  }
  removeDate(phoneno: string) {
    console.log("clicked remove date");
    let previous_data = this.Items;
    this.Items = [];
    let cd = new Date();
    const day = cd.getDate();
    const month = cd.getMonth() + 1; //  January is 0
    const year = cd.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
    return this.appointsvc
      .getAppointmentsbyDate(formattedDate, phoneno)
      .subscribe((result) => {
        console.log("result from appointments by date --", result);
        this.appointment_data = result;
        this.appointment_data.forEach((x: any, i: any) => {
          let call = {
            caller_number: "",
            Pet_type: "",
            Dept_name: "",
            selectedDate: "",
            selectedSlot: "",
            AppointmentStatus: "",
            Recording: "",
            Summary: "",
            DetailedStudy: "",
          };

          call.caller_number = x["phoneno"];
          call.Pet_type = x["Pet_type"];
          call.Dept_name = x["Dept_name"];
          call.selectedDate = x["selectedDate"];
          call.selectedSlot = x["selectedSlot"];
          call.AppointmentStatus = x["AppointmentStatus"];
          call.Recording = x["Recording"];
          call.Summary = x["ai_narration"]["Summary"];
          call.DetailedStudy = x["description"];

          this.Items.push(call);
          console.log("items : ", this.Items);
        });
        this.loading = false;
        console.log(this.Items);
        this.source = this.Items;
        this.changeDetectorRef.detectChanges();
      });
  }

  getbyTime1() {
    this.previous_data = this.Items;
    this.Items = [];
    console.log("going to pick data by time");
    const selected_time = this.selectedTime.value;
    console.log("selected time : ", selected_time);
    let tym = selected_time.split(" ")[0];
    let mer = selected_time.split(" ")[1];
    let sel_tym = tym + `:00 ` + mer;
    // const time24h = new Date(`1970-01-01T${selected_time}`).toLocaleTimeString("en-US", {hour12: false, hour: '2-digit', minute: '2-digit'});

    let time24h = new Date(`2000-01-01 ${sel_tym}`).toLocaleTimeString(
      "en-US",
      { hour12: false, hour: "2-digit", minute: "2-digit" }
    );
    console.log("received time in 24 hr format: ", time24h);

    this.appointment_data.forEach((x: any, i: any) => {
      let call = {
        caller_number: "",
        Pet_type: "",
        Dept_name: "",
        selectedDate: "",
        selectedSlot: "",
        AppointmentStatus: "",
        Recording: "",
        DetailedStudy: "",
      };

      call.caller_number = x["phoneno"];
      call.Pet_type = x["selectPet"][0]["pet_details"]["petType"];
      call.Dept_name = x["Dept_name"];
      call.selectedDate = x["selectedDate"];
      call.selectedSlot = x["selectedSlot"];
      call.AppointmentStatus = x["AppointmentStatus"];
      call.Recording = x["Recording"];
      if (x["description"]) {
        call.DetailedStudy = x["description"];
      }

      if (x["selectedSlot"]) {
        call.selectedSlot = x["selectedSlot"];
        let start_tym = call.selectedSlot.split("-")[0];
        console.log("call starting time : ", start_tym);
        console.log("time24h : ", time24h);
        console.log(
          "lengths start_tym nd time24h ",
          start_tym.length,
          time24h.length
        );
        // console.log('new call.selectedDate : ', selected_date)
        // console.log('new callDate : ',call_date)
        if (start_tym === time24h) {
          console.log("satisfying");
          this.Items.push(call);
          console.log("items : ", this.Items);
        }
      }
    });
    this.loading = false;
    console.log(this.Items);
    this.source = this.Items;
    this.changeDetectorRef.detectChanges();
  }
  getbyTime(phoneno: string) {
    this.Items = [];
    console.log("going to pick data by time");
    const selected_time = this.selectedTime.value;
    console.log("selected time : ", selected_time);
    return this.appointsvc
      .getAppointmentsbyTime(selected_time, phoneno)
      .subscribe((result) => {
        console.log("result from appointments by date --", result);
        this.appointment_data = result;
        this.appointment_data.forEach((x: any, i: any) => {
          let call = {
            caller_number: "",
            Pet_type: "",
            Dept_name: "",
            selectedDate: "",
            selectedSlot: "",
            AppointmentStatus: "",
            Recording: "",
            Summary: "",
            DetailedStudy: "",
          };

          call.caller_number = x["phoneno"];
          call.Pet_type = x["Pet_type"];
          call.Dept_name = x["Dept_name"];
          call.selectedDate = x["selectedDate"];
          call.selectedSlot = x["selectedSlot"];
          call.AppointmentStatus = x["AppointmentStatus"];
          call.Recording = x["Recording"];
          call.Summary = x["ai_narration"]["Summary"];
          call.DetailedStudy = x["description"];

          this.Items.push(call);
          console.log("items : ", this.Items);
        });
        this.loading = false;
        console.log(this.Items);
        this.source = this.Items;
        this.changeDetectorRef.detectChanges();
      });
  }

  getBypet(event: any) {
    const filterValue = event.target.value;
    const regex1 = /(\b\w+\b)$/; // Regular expression to match the last word in the string

    const match = filterValue.match(regex1);
    console.log("hi", filterValue);
    // console.log("hiii",this.sorted_date)
    this.loading = true;
    this.Items = [];
    const regex = new RegExp("\\b" + match + "\\b", "i");

    this.appointment_data.forEach((x: any) => {
      console.log("x value", x);

      if (x["selectPet"][0]["pet_details"]["petType"]) {
        let dept_name = x["selectPet"][0]["pet_details"]["petType"];
        console.log("selected filter", match[0]);
        console.log("dept in current data", dept_name);
        console.log("sta", dept_name.includes(match[0]));
        if (match[0] == "all" || dept_name.includes(match[0])) {
          console.log(x["Dept_name"]);
          let call = {
            caller_number: "",
            Pet_type: "",
            Dept_name: "",
            selectedDate: "",
            selectedSlot: "",
            AppointmentStatus: "",
            Recording: "",
            DetailedStudy: "",
          };

          call.caller_number = x["phoneno"];
          call.Pet_type = x["selectPet"][0]["pet_details"]["petType"];
          call.Dept_name = x["Dept_name"];
          call.selectedDate = x["selectedDate"];
          call.selectedSlot = x["selectedSlot"];
          call.AppointmentStatus = x["AppointmentStatus"];
          call.Recording = x["Recording"];
          if (x["description"]) {
            call.DetailedStudy = x["description"];
          }

          // call.DetailedStudy = x["ai_narration"]['DetailedStudy']

          this.Items.push(call);
          console.log("items : ", this.Items);
        } else {
          this.Items = this.Items;
        }
      }
    });
    this.loading = false;
    console.log(this.Items);
    this.source = this.Items;
    this.changeDetectorRef.detectChanges();
  }

  getBydept(event: any) {
    // const filterValue = event;
    const filterValue = event.target.value;
    const regex1 = /(\b\w+\b)$/;

    const match = filterValue.match(regex1);
    console.log("selected filter", match[0]);
    console.log("filterValue", filterValue);
    // console.log("hiii",this.sorted_date)
    this.loading = true;
    this.Items = [];
    // const regex = new RegExp('\\b' + match + '\\b', 'i');
    console.log("appointment_data : ", this.appointment_data);
    this.appointment_data.forEach((x: any) => {
      console.log("value of each record", x);
      if (x["Dept_name"]) {
        // console.log(x["department_name"])
        let dept_name = x["Dept_name"];

        console.log("dept in current data", dept_name);

        // console.log("is matching",dept_name.includes(filterValue))
        // if (filterValue=='all'||dept_name.includes(filterValue) ){
        console.log("sta", dept_name.includes(match[0]));
        if (match[0] == "all" || dept_name.includes(match[0])) {
          console.log(x["Dept_name"]);
          let call = {
            caller_number: "",
            Pet_type: "",
            Dept_name: "",
            selectedDate: "",
            selectedSlot: "",
            AppointmentStatus: "",
            Recording: "",
            DetailedStudy: "",
          };

          call.caller_number = x["phoneno"];
          call.Pet_type = x["selectPet"][0]["pet_details"]["petType"];
          call.Dept_name = x["Dept_name"];
          call.selectedDate = x["selectedDate"];
          call.selectedSlot = x["selectedSlot"];
          call.AppointmentStatus = x["AppointmentStatus"];
          call.Recording = x["Recording"];

          call.DetailedStudy = x["description"];

          this.Items.push(call);
          console.log("items : ", this.Items);
        }
      } else {
        this.Items = this.Items;
      }
    });
    this.loading = false;
    console.log(this.Items);
    this.source = this.Items;
    this.changeDetectorRef.detectChanges();
  }

  appointmentType(event: any) {
    const filterValue = event.target.value;
    console.log("filterValue : ", filterValue);
    return this.appointsvc
      .get_whole_appoint(filterValue)
      .subscribe((res: any) => {
        this.appointment_data = res;
        console.log("got the whole data from the dynamo", res);
        this.Items = [];
        this.appointment_data.forEach((x: any, i: any) => {
          if (x["phoneno"]) {
            let call = {
              caller_number: "",
              Pet_type: "",
              Dept_name: "",
              selectedDate: "",
              selectedSlot: "",
              AppointmentStatus: "",
              Recording: "",
              Summary: "",
              DetailedStudy: "",
            };

            call.caller_number = x["phoneno"];
            call.Pet_type = x["selectPet"][0]["pet_details"]["petType"];
            call.Dept_name = x["Dept_name"];
            call.selectedDate = x["selectedDate"];
            call.selectedSlot = x["selectedSlot"];
            call.AppointmentStatus = x["AppointmentStatus"];
            call.Recording = x["Recording"];
            // if (x["ai_narration"]["Summary"]==undefined){
            call.Summary = "";
            call.DetailedStudy = "";

            this.Items.push(call);
            console.log("items : ", this.Items);
          } else {
            this.Items = this.Items;
          }
        });
        this.loading = false;
        console.log(this.Items);
        this.source = this.Items;
        this.changeDetectorRef.detectChanges();
        console.log(
          "show_whole_appointments after whole_appointments : ",
          this.show_whole_appointments
        );
        // console.log('changeDetectorRef : ', this.changeDetectorRef)
        this.updateTitlePanel();
      });
  }

  whole_appointments() {
    console.log("clicked");
    this.show_whole_appointments = true;
    console.log("show_whole_appointments : ", this.show_whole_appointments);
    this.changeDetectorRef.detectChanges();
    return this.appointsvc
      .get_whole_appoint(this.role)
      .subscribe((res: any) => {
        this.appointment_data = res;
        console.log("got the whole data from the dynamo", res);
        this.Items = [];
        this.appointment_data.forEach((x: any, i: any) => {
          if (x["phoneno"]) {
            let call = {
              caller_number: "",
              Pet_type: "",
              Dept_name: "",
              selectedDate: "",
              selectedSlot: "",
              AppointmentStatus: "",
              Recording: "",
              Summary: "",
              DetailedStudy: "",
            };

            call.caller_number = x["phoneno"];
            call.Pet_type = x["selectPet"][0]["pet_details"]["petType"];
            call.Dept_name = x["Dept_name"];
            call.selectedDate = x["selectedDate"];
            call.selectedSlot = x["selectedSlot"];
            call.AppointmentStatus = x["AppointmentStatus"];
            call.Recording = x["Recording"];
            // if (x["ai_narration"]["Summary"]==undefined){

            // }
            // else{
            // call.Summary = x["ai_narration"]["Summary"];}
            call.DetailedStudy = x["description"];
            // x["ai_narration"]["DetailedStudy"];

            this.Items.push(call);
            console.log("items : ", this.Items);
          } else {
            this.Items = this.Items;
          }
        });
        this.loading = false;
        console.log(this.Items);
        this.source = this.Items;
        this.changeDetectorRef.detectChanges();
        console.log(
          "show_whole_appointments after whole_appointments : ",
          this.show_whole_appointments
        );
        // console.log('changeDetectorRef : ', this.changeDetectorRef)
        this.updateTitlePanel();
      });
  }

  updateTitlePanel() {
    if (this.show_whole_appointments) {
      this.titlePanel = {
        enabled: true,
        template: () => `
        <div class='title-panel p-2 bg-dark bg-gradient text-white text-center'>
            <h3>
                <span style="font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                    Whole Appointments
                </span>
            </h3>
          
        </div>`,
      };
    } else {
      this.titlePanel = {
        enabled: true,
        template:
          () => `<div class='title-panel p-2 bg-dark bg-gradient text-white text-center'> 
        <h3>
          <span style="font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
              Appointments for you
          </span>
        </h3>
      
    </div> `,
      };
    }
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
      console.log(
        "show_whole_appointments //// ",
        this.show_whole_appointments
      );
      return `
        <div class='title-panel p-2 bg-dark bg-gradient text-white text-center'>
            <h3>
                <span style="font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                    Appointments for You
                </span>
            </h3>
          
        </div>`;
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
      header: "Phone number",
      field: "caller_number",
    },

    {
      header: "Pet type",
      field: "Pet_type",
      sorting: false,
    },
    {
      header: "Department",
      field: "Dept_name",
    },
    {
      header: "Selected Date",
      field: "selectedDate",
    },
    {
      header: "Selected Slot",
      field: "selectedSlot",
      // view: GuiCellView.CHIP,
    },
    {
      header: "Appointment Status",
      field: "AppointmentStatus",
      view: GuiCellView.CHIP,
    },
    {
      header: "Audio",
      field: "Recording",
      view: (value: string) => {
        return `<audio controls><source src=${value} type="audio/mpeg"></audio>`;
      },
      width: 275,
    },
    {
      header: "Analysis",
      field: "",
      view: (value: string) => {
        return `<ng-template let-item="item">
          <a class="btn btn-summary"">Examine</a>
      </ng-template>`;
      },
    },
  ];
  // <a  [routerLink]="['appointments']" class="btn btn-summary"">Examine</a>
  // href="http://localhost:4200/appointments?actor_id=${value}"
  // href="http://localhost:4200/appointments?actor_id=${item}"
  rowDetail: GuiRowDetail = {
    enabled: true,
    template: (item) => {
      return `
        
        <div class='user-detail'>
        <div style="align:left">
        
        </div>       
  
          <div><b>Phone:</b>${item.caller_number}  
          <span><b>Division:</b>${item.Dept_name}</span></div>   
          <div><b>Selected Date:</b><p> ${item.selectedDate}</p>
        
        <span><b>Selected Time: </b> ${item.selectedSlot}</span></div>
        
        <div><b>Detailed study:</b><p> ${item.DetailedStudy}</p></div>   
          
          
          <div><b> Appointment Status: </b><p>${item.AppointmentStatus}</p></div>
          <a class="btn btn-danger"">Close Appointment</a>
          
          
    
          
        </div>`;
    },
  };
}
