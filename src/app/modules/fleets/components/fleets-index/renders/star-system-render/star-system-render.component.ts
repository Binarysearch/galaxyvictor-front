import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Fleet } from 'src/app/model/fleet';
import { CellRenderer, RowCell } from '@piros/table';
import { StarSystem } from 'src/app/model/star-system';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-star-system-render',
  templateUrl: './star-system-render.component.html',
  styleUrls: ['./star-system-render.component.css']
})
export class StarSystemRenderComponent implements OnDestroy, CellRenderer<Fleet> {
  
  starSystem: StarSystem;
  fleet: Fleet;
  destroyed: Subject<void> = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  ptInit(cell: RowCell<Fleet>): void {
    this.starSystem = cell.row.destination;
    this.fleet = cell.row;
    this.starSystem.getChanges().pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
