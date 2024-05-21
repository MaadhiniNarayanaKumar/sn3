import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupFormGroup!: FormGroup;
  errorMessage: string | undefined;

  constructor(private http:HttpClient, private router:Router, private formBuilder: FormBuilder) {}

  name: string = '';
  email: string = '';
  password: string = '';

  nameFocused: boolean = false;
  emailFocused: boolean = false;
  passwordFocused: boolean = false;

  ngOnInit(): void {
    this.signupFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  checkFieldValidity(fieldName: string): boolean {
    const control = this.signupFormGroup.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
  // submitForm() {
  //   // Here you can implement your logic to submit the form data
  //   console.log('Form submitted!');
  //   console.log('Name:', this.name);
  //   console.log('Email:', this.email);
  //   console.log('Password:', this.password);
  // }

  submitForm() {
    if (this.signupFormGroup.invalid) {
      console.error('Please fill in all fields');
      return;
    }
    
    const formData = this.signupFormGroup.value;

    this.http.post<any>('http://localhost:4000/signup', formData).subscribe(
      response => {
        console.log('Form data saved successfully:', response);

        
          this.signupFormGroup.reset();
          this.router.navigate(['/playground']);
        
      },
      
      
    
      error => {
        console.error('Error saving form data:', error);
        if (error.error && error.error.error === 'email already exists') {
          this.signupFormGroup.reset();
          // Update error message in Angular component
          this.errorMessage = 'Email already exists.';
        } else {
          this.signupFormGroup.reset();
          this.errorMessage = 'An error occurred while processing your request. Please try again later.';
        }
      }
    )}

  onLoginClick(){
    this.router.navigate(['/login']);

  }

}
