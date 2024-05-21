import { Component,ElementRef } from '@angular/core';

@Component({
  selector: 'app-ecommerce-load-dataset',
  templateUrl: './ecommerce-load-dataset.component.html',
  styleUrl: './ecommerce-load-dataset.component.css'
})
export class EcommerceLoadDatasetComponent {
  constructor(private elementRef: ElementRef<HTMLElement>) {}
  disabled=true;
  selectDataset(event:any){
    console.log(event.target.innerHTML)
    this.disabled=false;
  }
  loadDataset(event:any){
    console.log(event.target.innerHTML)
    this.disabled=true;
  }

}
