import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  loginFormGroup!: FormGroup;

  emailFocused: boolean = false;
  passwordFocused: boolean = false;
// submitted: any;
submitted = false;

  constructor(private authService: AuthService, private http: HttpClient, private router:Router, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  } 


  loginForm(){

    if (this.loginFormGroup.invalid) {
      // Form is invalid, do not proceed with authentication
      return;
    }

    const formData = this.loginFormGroup.value;


    this.authService.authenticate(formData.email, formData.password).subscribe(
      response => {
        console.log('Authentication successful:', response);
        this.email = '';
        this.password = '';
        this.authService.setAuthenticationStatus(true)

      },
      error => {
        console.error('Authentication Failed:', error);
      }
    );
    this.router.navigate(['/playground']);
  }

  Login() {
    this.router.navigate(['/playground']);
  }
  
}
