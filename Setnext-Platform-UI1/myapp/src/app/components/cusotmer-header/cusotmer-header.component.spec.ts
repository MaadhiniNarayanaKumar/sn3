import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusotmerHeaderComponent } from './cusotmer-header.component';

describe('CusotmerHeaderComponent', () => {
  let component: CusotmerHeaderComponent;
  let fixture: ComponentFixture<CusotmerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CusotmerHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CusotmerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
