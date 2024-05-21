import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
// import { Cart } from "src/app/interfaces/Cart";
// import { CartItem } from "src/app/interfaces/CartItem";
// import { ObjectType } from "src/app/interfaces/User";
// import { AuthService } from "../authService/auth.service";
import { ConfigService } from './config.service';
import { phone } from 'ngx-bootstrap-icons';
// import { LocalService } from "../storage/local.service";

@Injectable({
  providedIn: 'root',
})
export class CallService {
  callServiceUrl = '';
  phonenumber = '';
  call_date = "";
  caller_id ="";

  constructor(private http: HttpClient, private config: ConfigService) {
    console.log('CallServiceUrl:', config.config.callServiceUrl);

    this.callServiceUrl = config.config.callServiceUrl;
  }

  get_call_details(call_date:string,caller_id:string){
    
    let id = call_date + "|" + caller_id
    console.log('id from call service.ts', id)
    return this.http
    .get<any>(this.callServiceUrl + `/calls/`+id +'?ft=uuid', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
  
    })
    .pipe(
      catchError((err: any) => {
        ////console.log("errrorrrrr", err);
        return throwError(err); //Rethrow it back to component
      })
    );


  }

  gethistory(phonenumber: string){
    this.phonenumber = phonenumber;

    console.log('sending ph number is', phonenumber)

    return this.http
      .get<any>(this.callServiceUrl + `/calls/`+phonenumber, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
    
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }


  getCart(callDate: string): Observable<any> {
    if (callDate == '') {
      callDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    }
    console.log('received date', callDate);

    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'x-api-key':'sdsds',
      'Access-Control-Allow-Origin': '*'
    };

    const requestOptions = {
      headers: new Headers(headerDict),
    };
    console.log("calling the call date ap q i")
    return this.http
      .get<any>(this.callServiceUrl + "/calls", {
        headers: headerDict,
        params: {
          cd: callDate,
        },
      })
      .pipe(
        catchError((err) => {
          return throwError(err); //Rethrow it back to component
        })
      );
  }

get_appoint(phonenumber: string){
  this.phonenumber = phonenumber;

  console.log('sending ph number is', phonenumber)

  return this.http
    .get<any>(this.callServiceUrl + `/appointment/`+phonenumber, {
      // .get<any>(this.callServiceUrl + `/appointment/` + phonenumber,{
      headers: {
        'Access-Control-Allow-Origin': '*',
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
