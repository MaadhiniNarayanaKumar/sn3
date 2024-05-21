import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceLoadDatasetComponent } from './ecommerce-load-dataset.component';

describe('EcommerceLoadDatasetComponent', () => {
  let component: EcommerceLoadDatasetComponent;
  let fixture: ComponentFixture<EcommerceLoadDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EcommerceLoadDatasetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcommerceLoadDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
