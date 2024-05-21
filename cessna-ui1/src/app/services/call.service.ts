import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
// import { Cart } from "src/app/interfaces/Cart";
// import { CartItem } from "src/app/interfaces/CartItem";
// import { ObjectType } from "src/app/interfaces/User";
// import { AuthService } from "../authService/auth.service";
import { ConfigService } from './config.service';
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
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const requestOptions = {
      headers: new Headers(headerDict),
    };

    return this.http
      .get<any>(this.callServiceUrl + '/calls', {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        params: {
          cd: callDate,
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
