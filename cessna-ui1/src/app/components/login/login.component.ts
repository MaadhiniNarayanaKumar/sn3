import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { LocalService } from "../../services/local.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router,  NavigationExtras} from '@angular/router';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  loginForm: any;
  submitted = false;

  
  logginError = "";
  constructor(
    private authService: AuthService,
    private router: Router,
    private localService: LocalService
  ) {
    this.loginForm = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }

  login(data: any) {
    console.log("login action received");
    this.submitted = true;
    console.log("form valid", this.loginForm?.invalid);

    // if (this.loginForm?.invalid) {
    //   return;
    // }

    console.log("data: ", data);

    this.logginError = "";
    let userName = data.userName.trim();
    let password = data.password.trim();
    this.authService.login(userName, password).subscribe((result) => {
      console.log(result);

      if (result.authStatus == "true") {
        this.authService.setLogginStatus(true);
        const navigationExtras: NavigationExtras = {
          state: result
        }        
        console.log(result)
        this.localService.setUserData('user_data',result.full_data.functional_role+'< >'+result.full_data.firstname+'< >'+result.full_data.phoneno)
        this.router.navigateByUrl("landing");
      } else {
        this.logginError =
          "Authentication Failed, Please check the UserName/Pasword";
      }
    });
  }
}
