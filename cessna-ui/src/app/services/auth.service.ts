import { Injectable } from "@angular/core";
import { LocalService, ObjectType } from "./local.service";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, catchError, throwError } from "rxjs";
import { User } from "../interface/user";
import { ServiceError } from "../interface/serviceError";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private localStore: LocalService, private http: HttpClient) {}
  isLoggedIn = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedIn.asObservable();
  authServiceError = new Subject<ServiceError>();
  authServiceError$ = this.authServiceError.asObservable();
  user_data: User | null = null;

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

  getUserData() {
    if (this.LoginStatus()) {
      this.user_data = this.localStore.getData(
        "user_data",
        ObjectType.json,
        true
      );
      return this.user_data;
    } else {
      throw new Error("User Not Authenticated");
    }
  }

  setLogginStatus(status: boolean, user_data?: any) {
    if (status == true) {
      console.log("User Data in auth service", user_data);

      this.localStore.saveData("isLoggedIn", "true", ObjectType.text, false);
      this.localStore.saveData("user_data", user_data, ObjectType.json, true);
      this.user_data = user_data;
      console.log("SS", this.user_data);
      this.isLoggedIn.next(status);
    } else {
      this.localStore.saveData("isLoggedIn", "false", ObjectType.text, false);
      this.localStore.removeData("user_data");
      this.user_data = null;
      this.isLoggedIn.next(status);
    }
  }

  login(phoneno: string, password: string) {
    const body = {
      phoneno: phoneno,
      password: password,
    };
    const auth_url =
      "https://8gxpsoay8f.execute-api.us-east-1.amazonaws.com/dev"; 

    // const auth_url = "http://localhost:4000";


    return this.http
      .post<any>(auth_url + "/users/auth", body, {
        headers: {
          "content-type": "application/json",
          "x-api-key":
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        },
      })
      .pipe(
        catchError((err) => {
          console.log("Error Happened, ", err)
          let error = err.error;


          if(error.error_code){
            if(error.errors){

            let svvError:ServiceError={isError:true,error:error.errors[0] }
          this.authServiceError.next(svvError);
        }else
        {
          let svvError:ServiceError={isError:true,error:error.error }
          this.authServiceError.next(svvError);
        }

          }
          else{
            let svvError:ServiceError={isError:true,error:"Backend Error, Contact Administrator" }
            this.authServiceError.next(svvError);
          }

      
          
          
          
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
    let his = "no";
    let cc = "no";
    let iam = "no";
    let app = "no";
    if (user.callcenter) cc = "yes";
    if (user.iam) iam = "yes";
    if (user.history) his = "yes";
    if (user.appointment) app = "yes";
    const body = {
      phoneno: user.phoneno,
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
      email: user.email,
      state: user.state,
      city: user.city,
      role: user.role,
      functional_role: user.role,
      pin: user.pincode,
      password: user.password,
      branch: user.branch,
      access_role: {
        history: his,
        callcenter: cc,
        iam: iam,
        appointment: app,
      },
    };
    const auth_url = "http://localhost:4000";
    console.log("body: " + JSON.stringify(body));
    return this.http
      .post<any>(auth_url + "/signup", body, {
        headers: {
          "content-type": "application/json",
          
        },
      })
      .pipe(
        catchError((err) => {
          // if(err.code==)
          console.log(err);
          if (err.error.error == "Username already exists") {
            alert("Phone number already exists");
          }

          return throwError(err); //Rethrow it back to component
        })
      );
  }
}
