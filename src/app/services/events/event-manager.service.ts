import { Injectable } from '@angular/core';
import { EndTravelEventService } from './end-travel-event.service';
import { ExploreStarSystemEventService } from './explore-star-system-event.service';
import { StartTravelEventService } from './start-travel-event.service';
import { VisibilityGainedEventService } from './visibility-gained-event.service';
import { VisibilityLostEventService } from './visibility-lost-event.service';

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {

  constructor(
    private endTravelEventService: EndTravelEventService,
    private exploreStarSystemEventService: ExploreStarSystemEventService,
    private startTravelEventService: StartTravelEventService,
    private visibilityGainedEventService: VisibilityGainedEventService,
    private visibilityLostEventService: VisibilityLostEventService
  ) {
    endTravelEventService.getEvents().subscribe(console.log);
    startTravelEventService.getEvents().subscribe(console.log);
    exploreStarSystemEventService.getEvents().subscribe(console.log);
    visibilityGainedEventService.getEvents().subscribe(console.log);
    visibilityLostEventService.getEvents().subscribe(console.log);
  }

  
}
