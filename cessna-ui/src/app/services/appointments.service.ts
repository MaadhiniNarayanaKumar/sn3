import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  callServiceUrl = '';
  role = '';
  phonenumber = "";

  constructor(private http: HttpClient, private config: ConfigService) {
    console.log('CallServiceUrl:', config.config.callServiceUrl);

    this.callServiceUrl = config.config.callServiceUrl;
  }

  get_whole_appoint(role:string){
    console.log('role from whole appoints : ', role)
    return this.http
      .get<any>(this.callServiceUrl + '/appointments/', {
        // .get<any>(this.callServiceUrl + `/appointment/` + phonenumber,{
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        params : {
          role: role
        }
    
      })
      .pipe(
        catchError((err) => {
          console.log("errrorrrrr");
          return throwError(err); //Rethrow it back to component
        })
      );
  }

  
  get_appoint(cd:string,phonenumber: string,role: string){
    this.phonenumber = phonenumber;
  
    console.log('sending ph number is', phonenumber)
    console.log('reached the date from svc : ', cd)
  
    return this.http
      .get<any>(this.callServiceUrl + '/appointments/'+role +'/'+phonenumber, {
        // .get<any>(this.callServiceUrl + `/appointment/` + phonenumber,{
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        params: {
          cd: cd,
          role: role,
          ph : phonenumber
        },
    
      })
      .pipe(
        catchError((err) => {
          console.log("errrorrrrr");
          return throwError(err); //Rethrow it back to component
        })
      );
  }
  
  getAppointmentsbyDate(callDate: string,phone_number:string): Observable<any> {
    if (callDate == '') {
      callDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    }
    console.log('received date', callDate);
    console.log('received phone number', phone_number);
  
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  
    const requestOptions = {
      headers: new Headers(headerDict),
    };
  
    return this.http
      .get<any>(this.callServiceUrl + '/appointment', {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        params: {
          cd: callDate,
          ph: phone_number,
        },
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }
  
  getAppointmentsbyTime(time:string,phone_number:string){
    console.log('received time', time);
    console.log('received phone number', phone_number);
  
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  
    const requestOptions = {
      headers: new Headers(headerDict),
    };
  
    return this.http
      .get<any>(this.callServiceUrl + '/appointment', {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        params: {
          tm: time,
          ph: phone_number,
        },
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }
  
  getAppointmentsbyType(pet_type: string,phone_number: string){
    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  
    const requestOptions = {
      headers: new Headers(headerDict),
    };
  
    return this.http
      .get<any>(this.callServiceUrl + '/appointment', {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        params: {
          type: pet_type,
          ph: phone_number,
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
