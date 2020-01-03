import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CellRenderer, RowCell } from '@piros/table';
import { Fleet } from 'src/app/model/fleet';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-status-render',
  templateUrl: './status-render.component.html',
  styleUrls: ['./status-render.component.css']
})
export class StatusRenderComponent implements OnDestroy, CellRenderer<Fleet> {
  
  fleet: Fleet;
  destroyed: Subject<void> = new Subject();

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  ptInit(cell: RowCell<Fleet>): void {
    this.fleet = cell.row;
    this.fleet.getChanges().pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
  
}
