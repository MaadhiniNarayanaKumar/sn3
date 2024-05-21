import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-customer-landing',
  templateUrl: './customer-landing.component.html',
  styleUrl: './customer-landing.component.css'
})
export class CustomerLandingComponent implements OnInit {
  @ViewChild('canvas3d') myElement: ElementRef | undefined;
  canvas:any

 ngOnInit(): void {
  
  
 }

 ngAfterViewInit() {
  console.log("afterinit");
  setTimeout(() => {
    this.canvas = this.myElement?.nativeElement;
  const spline = new Application(this.canvas);
  
  spline.load('https://prod.spline.design/4c6hVPGCZRCKEP4c/scene.splinecode');
  }, 1000);
}






}
