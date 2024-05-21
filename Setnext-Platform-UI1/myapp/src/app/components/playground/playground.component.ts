import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css'
})
export class PlaygroundComponent {

  constructor(private router:Router, http:HttpClient) {}

  ngOnInit(): void{
  }

  enterprise() {
    this.router.navigate(['/playground/enterprise-expert'])
  }
  audio() {
    this.router.navigate(['/playground/audio-analytics'])
  }
  video() {
    this.router.navigate(['/playground/video-analytics'])
  }
  image() {
    this.router.navigate(['/playground/image-processing'])
  }
  code() {
    this.router.navigate(['/playground/code-generation'])
  }
  ecommerce() {
    this.router.navigate(['/playground/ecommerce-load-dataset'])
  }
}
