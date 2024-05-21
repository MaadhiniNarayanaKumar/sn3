import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PatienthistoryService {
  patient_id = ""
  fromDate:any
  toDate:any
  historyServiceUrl : String=""
  filtertype=""
  constructor(private http: HttpClient, private config: ConfigService) {
    // console.log('CallServiceUrl:', config.config.callServiceUrl);

    this.historyServiceUrl = config.config.historyServiceUrl;
  }

  getrecordhistory(patient_id:string,fromDate:string,toDate:string){
  
    this.patient_id = patient_id;
    this.fromDate=fromDate
    this.toDate=toDate
    this.filtertype="Datefilter"


    console.log('sending ph number is', patient_id)

    return this.http
      .get<any>(this.historyServiceUrl+`/history/filter`, {
        
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        params:{
          "patientid":this.patient_id,
          "fromDate":this.fromDate,
          "toDate":this.toDate,
          "filterType":this.filtertype
        }
    
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }


  getRoleHistory(patient_id: string){
    this.patient_id = patient_id;

    console.log('sending ph number is', patient_id)

    return this.http
      .get<any>(this.historyServiceUrl + `/history/pethistory/`+patient_id, {
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
}
