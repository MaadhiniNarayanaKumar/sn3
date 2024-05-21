import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = new Subject<boolean>();
  isLoggedIn$ = this.isLoggedIn.asObservable();
  
  

  constructor(private http:HttpClient) { }


  authenticate (email:string , password : string) : Observable<any> {
    return this.http.post<any>('http://localhost:4000/auth' , {email, password})
    .pipe(
      catchError(error=> {
        return throwError(error.error.message || 'Server Error')
      })
    )
      
  }

  isAuthenticated(){

    let isLoggedIn = localStorage.getItem("isLoggedIn")
    return (isLoggedIn=="true")



  }

  setAuthenticationStatus(isLoggedIn:boolean){

    if(isLoggedIn){
      localStorage.setItem("isLoggedIn","true")
     
    }
    else{
      localStorage.setItem("isLoggedIn","false")
    }
    this.isLoggedIn.next(isLoggedIn)

    
  }
}
