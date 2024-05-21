import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CallsComponent } from "./components/calls/calls.component";
import { LoginComponent } from "./components/login/login.component";
import { MoreinfoComponent } from "./components/moreinfo/moreinfo.component";

import { ChatuiComponent } from "./components/chatui/chatui.component";

import { HistoryComponent } from "./components/history/history.component";
import { CallDetailsComponent } from "./components/call-details/call-details.component";
import { PatientComponent } from "./components/patient/patient.component";
import { PatienthistoryComponent } from "./components/patienthistory/patienthistory.component";
import { LandingComponent } from "./components/landing/landing.component";
import { IamManagementComponent } from "./components/iam-management/iam-management.component";

import { AppointmentsComponent } from "./components/appointments/appointments.component";

import { myactivityComponent } from "./components/myactivity/myactivity.component";

const routes: Routes = [
  // { path: "", component: CallsComponent },
  { path: "login", component: LoginComponent },
  { path: "user", component: PatientComponent },
  { path: "patienthistory", component: PatienthistoryComponent },
  { path: "calls", component: CallsComponent },
  { path: "", component: LoginComponent },
  { path: "mi", component: MoreinfoComponent,
    children:[{
      path:"", component: CallDetailsComponent},
      {path: "history", component: HistoryComponent},
      {path: "details", component: CallDetailsComponent},
      {path: "chatui", component:ChatuiComponent},
    ]
   },
   { path: "landing", component: LandingComponent },
   { path: "iam", component: IamManagementComponent },

   {path:"appointments",component:AppointmentsComponent},

   {path:"myactivity", component: myactivityComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
