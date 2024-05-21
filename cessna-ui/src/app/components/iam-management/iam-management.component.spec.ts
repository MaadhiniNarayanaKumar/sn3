import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IamManagementComponent } from './iam-management.component';

describe('IamManagementComponent', () => {
  let component: IamManagementComponent;
  let fixture: ComponentFixture<IamManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IamManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IamManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
