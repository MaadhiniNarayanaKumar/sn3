import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioAnalyticsComponent } from './audio-analytics.component';

describe('AudioAnalyticsComponent', () => {
  let component: AudioAnalyticsComponent;
  let fixture: ComponentFixture<AudioAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
