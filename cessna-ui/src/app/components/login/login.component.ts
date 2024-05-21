import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LocalService, ObjectType } from "../../services/local.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../interface/user";
import { OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { ServiceError } from "../../interface/serviceError";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit{
  loginForm: any;
  submitted = false;
  userName = "";
  loading : boolean = false
  serviceError=""

  logginError = "";
  isvalid : boolean = true
  constructor(
    private authService: AuthService,
    private router: Router,
    private localService: LocalService,
    private arouter: ActivatedRoute,private renderer: Renderer2, private elRef: ElementRef
  ) {
    this.loginForm = new FormGroup({
      userName: new FormControl("", [Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      password: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.authService.authServiceError$.subscribe((err:ServiceError)=>{
      console.log("Service Error ", err)
      if(err.isError==true){
        this.loading=false;
        this.serviceError=err.error
      }
    })
    this.authService.setLogginStatus(false)
  }


  login(data: any) {
    console.log("login action received");
    this.serviceError=""
    this.submitted = true;
    this.loading = true
    console.log("form valid",this.loginForm?.invalid);

    if (this.loginForm?.invalid) {
      this.loading=false;
      console.log(this.loginForm.controls.userName.errors)
      return;
    }

    console.log("data: ", data);

    this.logginError = "";
    let userName = data.userName.trim();
    this.userName = userName;
    let password = data.password.trim();
    try{
    this.authService.login(userName, password).subscribe((result) => {
      console.log("result",result);


      if (result.status == "authenticated") {
        let logged_user: User = {
          first_name: result.first_name,
          last_name: result.last_name,
          email: result.email,
          phoneno: result.phoneno,
          principle: {
            functional_role: result.principle.functional_role,
            access_role: result.principle.access_role,
          },
          address: result.address,
          city: result.city,
          state: result.state,
          branch: result.branch,
          created_date: result.created_date,
          updated_date: result.updated_date,
        };

        console.log("Received User Details", logged_user);
        this.authService.setLogginStatus(true, logged_user);
        // this.localService.setUserData('user_data',result.full_data.functional_role+' '+result.full_data.username)
        this.loading= false
        this.router.navigateByUrl("/landing");

    
      } else {
        this.loading = false;
        this.isvalid=false
        console.log("spinner")
        this.logginError =
          "Authentication Failed, Please check the UserName/Pasword";
        this.submitted=false
      }
    });}
    catch(err){
      console.log("err",err)
      this.loading = false;
      this.isvalid=false
      this.submitted=false
      console.log("spinner")
      this.logginError =
        "Authentication Failed, Please check the UserName/Pasword";

    }
  
  
}

}
function err(value: ServiceError): void {
  throw new Error("Function not implemented.");
}

