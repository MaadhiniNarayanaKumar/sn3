import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECommerceRecommendationComponent } from './ecommerce-recommendation.component';

describe('ECommerceRecommendationComponent', () => {
  let component: ECommerceRecommendationComponent;
  let fixture: ComponentFixture<ECommerceRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ECommerceRecommendationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ECommerceRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
