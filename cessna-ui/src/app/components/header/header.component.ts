import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Route, Router } from "@angular/router";

import { LocalService, ObjectType } from "../../services/local.service";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { UserserviceService } from "../../services/userservice.service";
import { User } from "../../interface/user";

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit {
  // constructor(private authService: AuthService, private router: Router, private ls:LocalService) {}
  name = "Angular";
  public isCollapsed = false;
  isAuthenticated = false;

  user_role: any;
  welcome_user = "";
  user_data: User | null = null;
  first_name: any;
  last_name: any;
  f: any;
  phno: any;
  // passwordForm: FormGroup;
  password = "";
  submitted = false;
  pwd = false;
  close = true;

  passwordForm = new FormGroup({
    new_password: new FormControl("", {
      validators: [Validators.required, Validators.pattern(StrongPasswordRegx)],
    }),
    confirmpassword: new FormControl("", {
      validators: [Validators.required, Validators.pattern(StrongPasswordRegx)],
    }),
  });

  constructor(
    private authService: AuthService,
    private ls: LocalService,
    private fb: FormBuilder,
    private userService: UserserviceService,
    private router: Router
  ) {
    this.f = this.passwordForm.controls;
  }
  changePassword() {
    this.pwd = true;
  }

  passwordValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*()-_=+[\]{};:'",.<>?/\\|]/.test(value);
      const noCommonWords = !/(password|123456|qwerty)/i.test(value);

      if (
        !(
          hasUpperCase &&
          hasLowerCase &&
          hasDigit &&
          hasSpecialChar &&
          noCommonWords
        )
      ) {
        return { invalidPassword: true };
      }

      return null;
    };
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  get formControls() {
    return this.passwordForm.controls;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const { confirmpassword } = this.passwordForm.value;

      const { new_password } = this.passwordForm.value;
      if (confirmpassword === new_password) {
        this.submitted = true;
        const { confirmpassword } = this.passwordForm.value;
        this.password = this.f.confirmpassword.value;
        // console.log('confirmpassword',typeof(confirmpassword));
        // console.log('Form submitted successfully');
        // console.log('this.passwordForm.value', this.passwordForm.value);
        // console.log('this.password', this.password);

        this.userService
          .putpass(this.phno, this.password)
          .subscribe((result) => {
            console.log(result);
          });
        // this.Onclose();
        // this.close = false
        this.passwordForm.reset();
        window.alert("Password has been updated successfully");
      } else {
        this.submitted = false;
        console.log("Passwords do not match");
        window.alert("Passwords do not match");
        // thizs.pas?swordForm.reset()

        // console.log('this.passwordForm.value', this.passwordForm.value);
      }
    } else {
      console.log("Form has errors");
      // this.passwordForm.reset()
      window.alert("Passwords do not match");
    }
  }

  // onSubmit1() {
  //   if (this.passwordForm.valid) {
  //         this.submitted = true;
  //         // console.log('Form submitted successfully');
  //         const { confirmpassword } = this.passwordForm.value;
  //         this.password = confirmpassword;

  //         console.log('this.password',this.password)
  //         this.userService.putpass("6666", this.password).subscribe((result) => {
  //           console.log(result);
  //           this.pwd = false;
  //           alert("Password updated successfully")
  //         })
  //         // this.userService.putpass("6666",this.password)
  //         }
  //   else {
  //         console.log('Form has errors')}
  //   }
  Onclose() {
    console.log("Password page closed");
    this.pwd = false;
    this.close = true;
    return this.passwordForm.reset();
  }

  ngOnInit(): void {
    if (this.authService.LoginStatus()) {
      this.isAuthenticated = true;
      this.user_data = this.authService.getUserData();
      console.log("UserData ", this.user_data);
      console.log("user data ", this.user_data);
      this.first_name = this.user_data?.first_name;
      this.last_name = this.user_data?.last_name;
      this.user_role = this.user_data?.principle.functional_role;
      this.phno = this.user_data?.phoneno;
    }

    this.authService.isLoggedIn$.subscribe((status) => {
      console.log("status", status);

      this.isAuthenticated = status;
      if (this.isAuthenticated) {
        this.user_data = this.authService.getUserData();
        console.log("user data ", this.user_data);
        this.first_name = this.user_data?.first_name;
        this.last_name = this.user_data?.last_name;
        this.user_role = this.user_data?.principle.functional_role;
        this.phno = this.user_data?.phoneno;
      }
    });
  }

  gotoCalls() {
    this.router.navigateByUrl("/calls");
  }

  gotoappoint() {
    // this.router.navigateByUrl('/appointments');
    this.router.navigate(["/appointments"], {
      queryParams: { phoneno: this.user_data?.phoneno },
    });
  }

  gotoIAM() {
    this.router.navigateByUrl("/iam");
  }
  goto_my_activity() {
    this.router.navigate(["/myactivity"], {
      queryParams: { actor_id: this.user_data?.phoneno },
    });
  }
  pet_records() {
    this.router.navigate(["/user"], { queryParams: { role: "Patient" } });
  }
  logOut() {
    this.authService.setLogginStatus(false);
    this.router.navigateByUrl("/login");
  }
}
