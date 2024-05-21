import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CallsComponent } from "./components/calls/calls.component";
import { LoginComponent } from "./components/login/login.component";
import { MoreinfoComponent } from "./components/moreinfo/moreinfo.component";

import { ChatuiComponent } from "./components/chatui/chatui.component";

import { HistoryComponent } from "./components/history/history.component";
import { CallDetailsComponent } from "./components/call-details/call-details.component";
import { LandingComponent } from "./components/landing/landing.component";
import { IamManagementComponent } from "./components/iam-management/iam-management.component";

const routes: Routes = [
  { path: "calls", component: CallsComponent },
  { path: "", component: LoginComponent },
  { path: "landing", component: LandingComponent },
  { path: "iam", component: IamManagementComponent },
  { path: "mi", component: MoreinfoComponent,
    children:[{
      path:"", component: CallDetailsComponent},
      {path: "history", component: HistoryComponent},
      {path: "details", component: CallDetailsComponent},
      {path: "chatui", component:ChatuiComponent},
    ]
   },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
