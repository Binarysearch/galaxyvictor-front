import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { VisiblePlanet } from '../../services/visible-entities/visible-planets.service';
import { VisibleEntitiesService } from '../../services/visible-entities/visible-entities.service';
import { VisibleStar } from '../../services/visible-entities/visible-stars.service';
import { takeUntil } from 'rxjs/operators';
import { Planet } from 'src/app/model/planet';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-text-renderer',
  templateUrl: './text-renderer.component.html',
  styleUrls: ['./text-renderer.component.css']
})
export class TextRendererComponent implements OnInit, OnDestroy {

  private destroyed: Subject<void> = new Subject();
  public visiblePlanets: VisiblePlanet[] = [];
  public visibleStars: VisibleStar[] = [];

  constructor(
    private visibleEntitiesService: VisibleEntitiesService,
    private colorService: ColorService
  ) { }

  ngOnInit() {
    this.visibleEntitiesService.getVisiblePlanets().pipe(takeUntil(this.destroyed)).subscribe(
      visiblePlanets => this.visiblePlanets = visiblePlanets
    );
    this.visibleEntitiesService.getVisibleStars().pipe(takeUntil(this.destroyed)).subscribe(
      visibleStars => this.visibleStars = visibleStars
    );

  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getColor(p: Planet): string {
    if (p.colony) {
      return this.colorService.getCivilizationColorHex(p.colony.civilization.id);
    } else {
      return '#ffffff';
    }
  }
}
