import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { VisiblePlanet } from 'src/app/services/visible-entities/visible-planets.service';
import { VisibleEntitiesService } from 'src/app/services/visible-entities/visible-entities.service';

@Component({
  selector: 'app-text-renderer',
  templateUrl: './text-renderer.component.html',
  styleUrls: ['./text-renderer.component.css']
})
export class TextRendererComponent implements OnInit, OnDestroy {

  private destroyed: Subject<void> = new Subject();
  public visiblePlanets: VisiblePlanet[] = [];

  constructor(
    private mapHtml: VisibleEntitiesService
  ) { }

  ngOnInit() {
    this.mapHtml.getVisiblePlanets().subscribe(
      visiblePlanets => this.visiblePlanets = visiblePlanets
    );
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
