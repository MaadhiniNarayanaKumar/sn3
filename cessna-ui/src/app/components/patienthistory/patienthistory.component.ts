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
import { PatienthistoryService } from "../../services/patienthistory.service";
import { retry } from "rxjs";
import { FormControl } from "@angular/forms";
import { formatDate } from "@angular/common";
import { NgbDateStructAdapter } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-patient",
  templateUrl: "./patienthistory.component.html",
  styleUrl: "./patienthistory.component.css",
})
export class PatienthistoryComponent implements OnInit {
  filtersButtonText = "Filters";
  rowColoring = GuiRowColoring.EVEN;

  title = "cessna-ui";
  theme = "Material";
  history_data: [] = [];
  role = "";
  Items: any = [];
  source: Array<any> = [];
  isLoading = false;
  loading: boolean;
  isCollapsed = true;
  fromDate = new FormControl(formatDate(new Date(), "dd-MM-yyyy", "en"));
  todate = new Date().toLocaleString();
  patient_id = "";
  isDropdownOpen: boolean = false;

  subjects: any[] = [
    "All",
    "Pet Onboarding",
    "Appointment",
    "Screening",
    "Dignosis Centre",
    "Others - Second Opinion",
  ];

  toggleDropdown(event: MouseEvent) {
    this.isDropdownOpen = !this.isDropdownOpen;
    event.stopPropagation();
  }

  constructor(
    private patienthistorysvc: PatienthistoryService,
    private route: Router,
    private router: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.loading = true;
  }

  ngOnInit() {
    if (!this.authService.LoginStatus() == true) {
      console.log("Not Authenticated, So Refiecting to Login Screen`");
      this.route.navigateByUrl("/login");
    } else {
      console.log("Authenticated, Refiecting to Call Screen`");
      this.loading = true;
      this.router.queryParams.subscribe((i) => {
        let id = this.router.snapshot.queryParams["patient_id"];

        // let id = qp['id']
        let splitstring = id.split("|");
        this.patient_id = splitstring[0] + "_" + splitstring[1];

        console.log("PK: ", this.patient_id);

        // this.phone_number = i['ph']
        this.fetch_history(this.patient_id);
        console.log(this.patient_id);
      });

      this.patienthistorysvc.getRoleHistory(this.patient_id).subscribe(
        (result) => {
          console.log(result);
          this.history_data = result;
          this.source = this.history_data;
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
        (err) => {
          console.log("issue", err.error.message);
        }
      );
    }
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

    this.loading = true;
    this.Items = [];

    this.history_data.forEach((x: any) => {
      const statement = x["subject"];
      if (
        filterValue.toLowerCase() === "all" ||
        (statement &&
          statement.toLowerCase().includes(filterValue.toLowerCase()))
      ) {
        this.Items.push(x);
      }
    });

    this.loading = false;
    console.log(this.Items);
    this.source = this.Items;
    this.changeDetectorRef.detectChanges();
  }

  getdates() {
    console.log("is", this.fromDate, this.todate);
    const fromiso = this.formatISO(String(this.fromDate));
    const toiso = this.formatISO(String(this.todate));
    this.patienthistorysvc
      .getrecordhistory(this.patient_id, fromiso, toiso)
      .subscribe((res: any) => {
        this.history_data = res;
        this.source = this.history_data;

        console.log(this.history_data);
      });
  }

  formatISO(date: string) {
    const normalDate = new Date(date);
    const isoDateString = normalDate.toISOString();
    return isoDateString;
  }

  formattime(time: string) {
    // console.log("format")
    let new_time = time.replace(/[-:./ ]/g, "");
    return new_time;
  }
  formatdate(time1: string) {
    const dateString = time1;
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return formattedDate;
  }

  fetch_history(role: string) {
    console.log("phone number is ", role);
    return this.patienthistorysvc.getRoleHistory(role).subscribe((res: any) => {
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
			<div class='title-panel-example' >Patient Records</div>
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
      header: "Patient_id",
      field: "patient_id",
    },
    {
      header: "Time",
      field: "curret_time",
      sorting: false,
    },
    {
      header: "Role",
      field: "role",
    },
    {
      header: "Subject",
      field: "subject",
      view: GuiCellView.CHIP,
    },
  ];
}
