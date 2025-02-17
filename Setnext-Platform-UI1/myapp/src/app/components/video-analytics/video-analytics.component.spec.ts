import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAnalyticsComponent } from './video-analytics.component';

describe('VideoAnalyticsComponent', () => {
  let component: VideoAnalyticsComponent;
  let fixture: ComponentFixture<VideoAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoAnalyticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
