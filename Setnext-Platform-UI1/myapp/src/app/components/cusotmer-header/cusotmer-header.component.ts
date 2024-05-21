import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cusotmer-header',
  templateUrl: './cusotmer-header.component.html',
  styleUrl: './cusotmer-header.component.css'
})
export class CusotmerHeaderComponent implements OnInit {

  isAuthenticated =false

  constructor(private authService:AuthService){}
  ngOnInit(): void {

    if(this.authService.isAuthenticated()){
      this.isAuthenticated=true
    }

    this.authService.isLoggedIn$.subscribe(isAuthenticated=>{
      console.log("Authentication Status: ",isAuthenticated)
      this.isAuthenticated=isAuthenticated

    })
  }

}
