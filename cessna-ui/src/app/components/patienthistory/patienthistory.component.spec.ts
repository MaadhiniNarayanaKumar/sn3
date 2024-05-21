import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatienthistoryComponent } from './patienthistory.component';

describe('PatienthistoryComponent', () => {
  let component: PatienthistoryComponent;
  let fixture: ComponentFixture<PatienthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatienthistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PatienthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
