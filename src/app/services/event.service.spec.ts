import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { ApiService } from '@piros/api';

xdescribe('EventService', () => {
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: {} }
      ]
    });
  });

  it('should be created', () => {
    const service: EventService = TestBed.get(EventService);
    expect(service).toBeTruthy();
  });
});
