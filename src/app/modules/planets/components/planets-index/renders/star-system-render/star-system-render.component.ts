import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CellRenderer, RowCell } from '@piros/table';
import { Planet } from '../../../../../../model/planet';
import { StarSystem } from 'src/app/model/star-system';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-star-system-render',
  templateUrl: './star-system-render.component.html',
  styleUrls: ['./star-system-render.component.css']
})
export class StarSystemRenderComponent implements OnDestroy, CellRenderer<Planet> {
  
  starSystem: StarSystem;
  planet: Planet;
  destroyed: Subject<void> = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  ptInit(cell: RowCell<Planet>): void {
    this.starSystem = cell.row.starSystem;
    this.planet = cell.row;
    this.starSystem.getChanges().pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  hasFleets(): boolean {
    return this.starSystem.orbitingFleets.size > 0;
  }
  
  hasColony(): boolean {
    return this.planet.colony != null;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
