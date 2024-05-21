import { Component } from '@angular/core';
import { Router,Navigation } from '@angular/router';
import { LocalService } from '../../services/local.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(public router:Router){}
  gotoIAM(){
    this.router.navigateByUrl('/iam');
  }
}
