import { TestBed } from '@angular/core/testing';

import { HoverService } from './hover.service';
import { StarRendererService } from './render/star-renderer.service';
import { StarSystemsService } from './data/star-systems.service';
import { of } from 'rxjs';

describe('HoverService', () => {

  let starRendererSpy: jasmine.SpyObj<StarRendererService>;
  let starServiceSpy: jasmine.SpyObj<StarSystemsService>;


  beforeEach(() => {

    starRendererSpy = jasmine.createSpyObj('StarRendererService', ['getRenderScale']);
    starServiceSpy = jasmine.createSpyObj('StarSystemsService', ['getStarSystems']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StarRendererService, useValue: starRendererSpy },
        { provide: StarSystemsService, useValue: starServiceSpy }
      ]
    });

    starServiceSpy.getStarSystems.and.returnValue(of([]));
    
  });

  it('should be created', () => {
    const service: HoverService = TestBed.get(HoverService);
    expect(service).toBeTruthy();
  });
});
