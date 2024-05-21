import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserserviceService {
  callServiceUrl = "";
  role = "";
  phno = "";
  abc = 0;
  constructor(private http: HttpClient, private config: ConfigService) {
    console.log("CallServiceUrl:", config.config.callServiceUrl);
    console.log(this.abc);
    this.callServiceUrl = config.config.callServiceUrl;
  }

  getRoleHistory(role: string) {
    this.role = role;

    console.log("sending ph number is", role);

    return this.http
      .get<any>(this.callServiceUrl + `/users/` + role, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }
  getAcitveHistory(body: any) {
    // this.phno = phno;
    // const body={
    //   phoneno:phno,
    //   isActive:status
    // }
    console.log("sending ph number is", body);

    return this.http
      .put<any>(this.callServiceUrl + `/users/updinactive`, body, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }
  editUser(user: any) {
    return this.http
      .post<any>(this.callServiceUrl + `/users/upduser`, user, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
      .pipe(
        catchError((err) => {
          ////console.log("errrorrrrr", err);
          return throwError(err); //Rethrow it back to component
        })
      );
  }

  putpass(phno: string, password: string) {
    const body = {
      phno: phno,
      password: password,
    };
    console.log(body);

    const auth_url = "http://localhost:4000";

    return this.http
      .put<any>(auth_url + "/users/updpwd", body, {
        headers: {
          "content-type": "application/json",
        },
      })
      .pipe(
        catchError((err) => {
          return throwError(err); //Rethrow it back to component
        })
      );
  }
}
