import { BrowserModule } from '@angular/platform-browser';
import { GuiGridModule } from '@generic-ui/ngx-grid';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ColorTheme, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { HeaderComponent } from './components/header/header.component';
import { CallsComponent } from './components/calls/calls.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MarkdownModule} from 'ngx-markdown'
import { IgxRadialGaugeModule } from "igniteui-angular-gauges";
import {
  arrowDownCircleFill,
  arrowUpCircleFill,
  alarm,
  alarmFill,
  alignBottom,
  chat,
  chatDotsFill,
  chatFill,
  robot,
  clockHistory,
  bugFill,
  calendar2Heart,
  emojiSmile,
  emojiAngry,
} from 'ngx-bootstrap-icons';
import { AudioStreamComponent } from './components/audio-stream/audio-stream.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { MoreinfoComponent } from './components/moreinfo/moreinfo.component';

import { ChatuiComponent } from './components/chatui/chatui.component';
import { HistoryComponent } from './components/history/history.component';
import { CallDetailsComponent } from './components/call-details/call-details.component';
import {RoundProgressModule} from 'angular-svg-round-progressbar'
import { RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { IamManagementComponent } from './components/iam-management/iam-management.component';

import { AppointmentsComponent } from './components/appointments/appointments.component';
import { NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { PatientComponent } from './components/patient/patient.component';
import { PatienthistoryComponent } from './components/patienthistory/patienthistory.component';
import { myactivityComponent } from './components/myactivity/myactivity.component';
import { FormsModule } from '@angular/forms';
import { NgxGaugeModule } from 'ngx-gauge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



export const configFactory = (configService: ConfigService) => {
  return () => configService.loadConfig();
};
const icons = {
  alarm,
  alarmFill,
  alignBottom,
  arrowDownCircleFill,
  arrowUpCircleFill,
  chat,
  chatDotsFill,
  chatFill,
  robot,
  clockHistory,
  bugFill,
  calendar2Heart,
  emojiAngry,
  emojiSmile,
};

@NgModule({

  // declarations: [AppComponent, HeaderComponent, CallsComponent, AudioStreamComponent, LoginComponent, FooterComponent, MoreinfoComponent, HistoryComponent, ChatuiComponent,CallDetailsComponent, PatientsComponent, LandingComponent, IamManagementComponent, AppointmentsComponent], 

  declarations: [AppComponent, HeaderComponent, CallsComponent, AudioStreamComponent, LoginComponent, FooterComponent, MoreinfoComponent, HistoryComponent, ChatuiComponent,CallDetailsComponent, LandingComponent, IamManagementComponent, PatientComponent, AppointmentsComponent,PatienthistoryComponent, myactivityComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuiGridModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxGaugeModule,
    MatProgressSpinnerModule,
    MarkdownModule.forRoot(),
    NgxPaginationModule,
    NgbDropdownModule,
    RoundProgressModule,
    NgbTimepickerModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    NgxBootstrapIconsModule.pick(icons, {
      width: '1em',
      height: '1em',
      theme: ColorTheme.Danger,
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
