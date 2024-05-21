import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { PatientService } from "../../services/patient.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {
  GuiCellView,
  GuiColumn,
  GuiColumnMenu,
  GuiFooterPanel,
  GuiInfoPanel,
  GuiPaging,
  GuiPagingDisplay,
  GuiRowColoring,
  GuiSearching,
  GuiSorting,
  GuiTitlePanel,
} from "@generic-ui/ngx-grid";
import { FormControl } from "@angular/forms";
import { formatDate } from "@angular/common";
import { CallService } from "../../services/call.service";
import { DatePipe } from "@angular/common";
import { Subject, interval } from "rxjs";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import _, { forEach } from "lodash";
import { Sentiment } from "@aws-sdk/client-transcribe-streaming";

@Component({
  selector: "app-patient",
  templateUrl: "./patient.component.html",
  styleUrl: "./patient.component.css",
})
export class PatientComponent implements OnInit {
  filtersButtonText = "Filters";
  rowColoring = GuiRowColoring.EVEN;
  isCollapsed = true;

  title = "cessna-ui";
  theme = "Material";
  history_data: [] = [];
  role = "";
  Items: any = [];
  sorted_date: any = [];
  source: Array<any> = [];
  isLoading = false;
  loading: boolean = false;
  fromDate = new FormControl(formatDate(new Date(), "dd-MM-yyyy", "en"));
  isDropdownOpen: boolean = false;
  minDate: any;
  maxDate: any;

  subjects: any[] = [
    "All",
    "Pet Onboarding",
    "Appointment",
    "Screening",
    "Dignosis Centre",
    "Others - Second Opinion",
  ];
  searching: GuiSearching = {
    enabled: true,
    placeholder: "Search Phone Number",
  };

  constructor(
    private patientsvc: PatientService,
    private route: Router,
    private router: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation();
  }

  sortDates(dates: string[]): string[] {
    const sortedList = _.orderBy(dates, ["start_datetime"], ["desc"]);
    return sortedList;
  }

  ngOnInit() {
    console.log("Subjects array:", this.subjects);

    if (!this.authService.LoginStatus() == true) {
      console.log("Not Authenticated, So Refiecting to Login Screen`");
      this.route.navigateByUrl("/login");
    } else {
      console.log("Authenticated, Refiecting to Call Screen`");
      this.loading = true;

      this.patientsvc.getRoleHistory("Patient").subscribe(
        (result) => {
          console.log(result, "role is", this.role);
          this.history_data = result;

          this.history_data.forEach((x: any, i: any) => {
            // console.log(i);

            //  console.log(x['ai_narration'].Category);
            // console.log(x);
            let call = {
              caller_numer: "",
              address: "",
              city: "",
              functional_role: "",
              email: "",
              subject: "",
              pet_name: "",
              pet_number: "",
              created_date: "",
              pk: "",
            };

            call.caller_numer = x["phoneno"];
            call.address = x["address"];
            call.city = x["city"];
            call.subject = x["subject"];
            call.functional_role = x["functional_role"];
            call.email = x["email"];
            call.created_date = this.formatdate(x["created_date"]);

            console.log("pet_details", x["pet_details"]);
            if (x["pet_details"]) {
              let num_of_pets = x["pet_details"].length;
              console.log(num_of_pets);

              x["pet_details"].forEach((pet: { [x: string]: string }) => {
                call.pet_name = pet["petName"];
                call.pet_number = pet["number"];
                call.pk = x["phoneno"] + "|" + pet["number"];
                this.Items.push(call);
              });
            } else {
              this.Items.push(call);
            }
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

  getCallsByDate(date: any) {
    console.log("clicked");
    this.loading = true;
    this.Items = [];
    console.log(date.value);
    console.log(this.formatdate(date.value));

    // const callDate: any = this.fromDate.value;
    // const cd = new Date(callDate)
    //   .toLocaleDateString("en-GB")
    //   .replace(/\//g, "-");

    this.history_data.forEach((x: any, i: any) => {
      //  console.log(x['ai_narration'].Category);
      // console.log(x);
      console.log(typeof this.formatdate(x["created_date"]));
      if (this.formatdate(x["created_date"]) != this.formatdate(date.value)) {
        console.log(x["created_date"]);
        return;
      }
      let call = {
        caller_numer: "",
        address: "",
        city: "",
        functional_role: "",
        email: "",
        subject: "",
        pet_name: "",
        pet_number: "",
        created_date: "",
        pk: "",
      };

      call.caller_numer = x["phoneno"];
      call.address = x["address"];
      call.city = x["city"];
      call.subject = x["subject"];
      call.functional_role = x["functional_role"];
      call.email = x["email"];
      call.created_date = this.formatdate(x["created_date"]);

      console.log("pet_details", x["pet_details"]);
      if (x["pet_details"]) {
        let num_of_pets = x["pet_details"].length;
        console.log(num_of_pets);

        x["pet_details"].forEach((pet: { [x: string]: string }) => {
          call.pet_name = pet["petName"];
          call.pet_number = pet["number"];
          call.pk = x["phoneno"] + "|" + pet["number"];
          this.Items.push(call);
        });
      } else {
        this.Items.push(call);
      }
    });

    this.loading = false;
    console.log(this.Items);
    this.source = this.Items;
    this.changeDetectorRef.detectChanges();
  }

  filtersubject(event: any) {
    console.log(event);
    const filterValue = event;
    if (
      !filterValue ||
      !this.history_data ||
      !Array.isArray(this.history_data)
    ) {
      console.error(
        "Invalid input or history_data is not initialized properly."
      );
      return;
    }

    const regex1 = /(\b\w+\b)$/;
    const match = filterValue.match(regex1);
    if (!match) {
      console.error("No match found in filterValue.");
      return;
    }

    this.loading = true;
    this.Items = [];
    console.log(this.history_data);

    this.history_data.forEach((x: any) => {
      const statement = x["subject"];
      console.log("match", match);
      if (
        statement &&
        (match[0] === "All" ||
          statement.toLowerCase().includes(match[0].toLowerCase()))
      ) {
        console.log("hi");
        const call = {
          caller_numer: x["phoneno"],
          address: x["address"],
          city: x["city"],
          functional_role: x["functional_role"],
          email: x["email"],
          subject: x["subject"],
          Date: x["created_Date"],
          pet_name: "",
          pet_number: "",
          pk: "",
        };

        if (x["pet_details"]) {
          x["pet_details"].forEach((pet: { [x: string]: string }) => {
            const callCopy = { ...call };
            callCopy.pet_name = pet["petName"];
            callCopy.pet_number = pet["number"];
            callCopy.pk = x["phoneno"] + "|" + pet["number"];
            this.Items.push(callCopy);
          });
        } else {
          this.Items.push(call);
        }
      }
    });

    this.loading = false;
    console.log(this.Items);
    this.source = this.Items;
    this.changeDetectorRef.detectChanges();
  }

  formatdate(time1: string) {
    const isoString = time1;
    const ddmmyyyy = new Date(isoString)
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .join("-");
    console.log(ddmmyyyy);
    return ddmmyyyy;
  }

  fetch_history(role: string) {
    console.log("phone number is ", role);
    return this.patientsvc.getRoleHistory(role).subscribe((res: any) => {
      this.history_data = res;

      console.log(this.history_data);

      console.log(res);
    });
  }
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
			<div class='title-panel p-2 bg-dark bg-gradient text-white text-center'>
      <h3>
                <span style="font-size: 25px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
                    PET RECORDS
                </span>
            </h3>
          
        </div>
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
      header: "Date",
      field: "created_date",
    },
    {
      header: "Address",
      field: "address",
      sorting: false,
    },
    {
      header: "Role",
      field: "functional_role",
    },
    {
      header: "Subject",
      field: "subject",
    },
    {
      header: "Email",
      field: "email",
      view: GuiCellView.CHIP,
    },
    {
      header: "Pet",
      field: "pet_name",
      view: GuiCellView.CHIP,
    },
    {
      header: "Analysis",
      field: "pk",
      view: (value: string) => {
        return `<ng-template let-item="item">
			<a href="http://localhost:4200/patienthistory?patient_id=${value}" [routerLink]="['patienthistory']" class="btn btn-summary"">Examine</a>
		</ng-template>`;
      },
    },
  ];
}
