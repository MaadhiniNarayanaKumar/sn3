import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class myactivityService {
  historyServiceUrl : String = '';
  actor_id = '';
  fromDate: any;
  toDate: any;

  constructor(private http: HttpClient, private config: ConfigService) {
    console.log('CallServiceUrl:', config.config.historyServiceUrl);

    this.historyServiceUrl = config.config.historyServiceUrl;
  }


  getactorhistory(role:string,actor_id: string){
    this.actor_id = actor_id;

    console.log('sending ph number is', actor_id)

    return this.http
      .get<any>(this.historyServiceUrl + `/history/activity/`+role+"/"+ actor_id, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          // 'x-api-key': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        },
    
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }

  getrecordhistory(patient_id:string,fromDate:string,toDate:string){
    this.actor_id = patient_id;
    this.fromDate=fromDate
    this.toDate=toDate

    console.log('sending ph number is', this.actor_id)

    return this.http
    .get<any>(this.historyServiceUrl + `/history/activityfilter/`, {
        
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        params:{
          "actor_id":this.actor_id,
          "fromDate":this.fromDate,
          "toDate":this.toDate
        }
    
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }
}
