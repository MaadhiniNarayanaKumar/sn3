import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-playground-header',
  templateUrl: './playground-header.component.html',
  styleUrl: './playground-header.component.css'
})
export class PlaygroundHeaderComponent {

  constructor(private authService:AuthService,private route:Router){

  }
  logout(){
    this.authService.setAuthenticationStatus(false)
    this.route.navigateByUrl("/login")  
  }

}
