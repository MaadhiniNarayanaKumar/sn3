import { TestBed } from '@angular/core/testing';

import { MyactivityService } from './myactivity.service';

describe('MyactivityService', () => {
  let service: MyactivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyactivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
