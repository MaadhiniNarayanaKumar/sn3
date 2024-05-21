import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseExpertComponent } from './enterprise-expert.component';

describe('EnterpriseExpertComponent', () => {
  let component: EnterpriseExpertComponent;
  let fixture: ComponentFixture<EnterpriseExpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpriseExpertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterpriseExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
