import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Route, Router } from "@angular/router";
import { LocalService } from "../../services/local.service";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserServiceService } from "../../services/user-service.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit {
  // constructor(private authService: AuthService, private router: Router, private ls:LocalService) {}
  name = 'Angular';
  public isCollapsed = false;
  isAuthenticated=false;
  user_role='Patient';
  welcome_user='Welcome back, ';
  phno='';
  passwordForm: FormGroup;
  password = '';
  submitted = false;
  pwd=false;



  constructor(private authService: AuthService, private ls:LocalService,private fb: FormBuilder, private userService: UserServiceService,private router: Router) {
    this.passwordForm = this.fb.group({
      newpassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator()]],
      confirmpassword: ['', Validators.required]
    }, { validators: this.matchingPasswords('newpassword', 'confirmpassword') });
  }
  changePassword(){
    this.pwd=true
  }



  passwordValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*()-_=+[\]{};:'",.<>?/\\|]/.test(value);
      const noCommonWords = !/(password|123456|qwerty)/i.test(value);
  
      if (!(hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && noCommonWords)) {
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
          this.submitted = true;
          // console.log('Form submitted successfully');
          const { confirmpassword } = this.passwordForm.value;
          this.password = confirmpassword;
          
          console.log('this.password',this.password)
          this.userService.putpass("6666", this.password).subscribe((result) => {
            console.log(result);
            this.pwd = false;
            alert("Password updated successfully")
          })
          // this.userService.putpass("6666",this.password)
          }
    else {
          console.log('Form has errors')}
    }
    Onclose(){
      console.log('Password page closed')
      this.pwd = false;
    }
    
  ngOnInit(): void {

    this.authService.isLoggedIn$.subscribe(status=>{
      console.log('status', status);
      this.isAuthenticated = status;
    })
    let test:any=this.ls.getUserData("user_data");
    console.log(test)
    this.user_role=test.split('< >')[0];
    this.welcome_user=test.split('< >')[1];
    this.phno=test.split('< >')[2];
  }

  logOut() {
    this.authService.setLogginStatus(false);
    this.router.navigateByUrl("/login");
  }
}
