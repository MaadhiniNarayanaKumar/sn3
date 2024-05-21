import { Injectable } from "@angular/core";
import { LocalService, ObjectType } from "./local.service";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private localStore: LocalService, private http: HttpClient) {}
  isLoggedIn = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedIn.asObservable()


  LoginStatus() {
    //console.log("Checking Logging Status");

    const isLogged = this.localStore.getData(
      "isLoggedIn",
      ObjectType.text,
      false
    );
    //console.log("logged data fron local store",isLogged)
    if (isLogged != null && isLogged == "true") {
      return true;
    } else {
      return false;
    }
  }

  setLogginStatus(status: boolean) {
    console.log(status);
    this.isLoggedIn.next(status)
    if (status == true) {
      this.localStore.saveData("isLoggedIn", "true", ObjectType.text, false);
    } else {
      this.localStore.saveData("isLoggedIn", "false", ObjectType.text, false);
    }
  }

  login(phoneno: string, password: string) {
    const body = {
      phoneno: phoneno,
      password: password,
    };
    // const auth_url =
    //   "https://zush0qla4a.execute-api.us-east-1.amazonaws.com/testing";

    const auth_url = "http://localhost:4000";

    return this.http
      .post<any>(auth_url + "/auth", body, {
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
  createNewUser(user: any) {
    // const body=user;
    // const body = {
    //   phoneno: phoneno,
    //   password: password,
    // };
    // const auth_url =
    //   "https://zush0qla4a.execute-api.us-east-1.amazonaws.com/testing";
    let his="no";
    let cc="no";
    let iam="no";
    let app="no";
    if(user.callcenter)cc="yes";
    if(user.iam)iam="yes";
    if(user.history)his="yes";
    if(user.appointment)app="yes";
    const body={
      phoneno:user.phoneno,
      firstname:user.firstname,
      lastname:user.lastname,
      address:user.address,
      email:user.email,
      state:user.state,
      city:user.city,
      role:user.role,
      pin:user.pincode,
      password:user.password,
      branch:user.branch,
      access_role:{
        history:his,
        callcenter:cc,
        iam:iam,
        appointment:app}

    }
    const auth_url = "http://localhost:4000";
    console.log('body: ' + JSON.stringify(body));
    return this.http
      .post<any>(auth_url + "/signup", body, {
        headers: {
          "content-type": "application/json",
        },
      })
      .pipe(
        catchError((err) => {
          // if(err.code==)
            console.log(err)
          if(err.error.error=='Username already exists')
          {alert("Phone number already exists")}
          
          return throwError(err); //Rethrow it back to component
        })
      );
  }
  
  signupuser(user:any){
    const body={
      phoneno:user.phoneno,
      firstname:user.firstname,
      lastname:user.lastname,
      address:user.address,
      email:user.email,
      state:user.state,
      city:user.city,
      role:user.role
    }
    const auth_url = "http://localhost:4000";
    console.log('body: ' + JSON.stringify(body));
    return this.http
      .post<any>(auth_url + "/signup", body, {
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
