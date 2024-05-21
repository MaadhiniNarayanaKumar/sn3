import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  userServiceUrl : String = '';
  role = '';

  constructor(private http: HttpClient, private config: ConfigService) {
    console.log('CallServiceUrl:', config.config.callServiceUrl);

    this.userServiceUrl = config.config.userServiceUrl;
  }


  getRoleHistory(role: string){
    this.role = role;

    console.log('sending role is sv', role)

    return this.http
      .get<any>(this.userServiceUrl + "/users/role/" +role ,{
        headers: {
          'Access-Control-Allow-Origin': '*',
          // 'x-api-key': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
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

