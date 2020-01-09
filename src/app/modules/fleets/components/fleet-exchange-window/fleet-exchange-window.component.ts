import { Component, OnInit, Input } from '@angular/core';
import { Fleet } from '../../../../model/fleet';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShipsService } from '../../../../services/data/getters/ships.service';
import { Ship } from '../../../../model/ship';

@Component({
  selector: 'app-fleet-exchange-window',
  templateUrl: './fleet-exchange-window.component.html',
  styleUrls: ['./fleet-exchange-window.component.css']
})
export class FleetExchangeWindowComponent implements OnInit {
  
  private destroyed: Subject<void> = new Subject();

  @Input() fleet1: Fleet;
  @Input() fleet2: Fleet;
  
  ships1: Ship[] = [];
  ships2: Ship[] = [];

  constructor(
    private shipsService: ShipsService
  ) { }

  ngOnInit() {
    this.getShips();
    this.fleet1.getChanges().pipe(takeUntil(this.destroyed)).subscribe(()=>{
      this.shipsService.getFleetDetail(this.fleet1.id).subscribe(detail => this.ships1 = detail.ships);
    });
    this.fleet2.getChanges().pipe(takeUntil(this.destroyed)).subscribe(()=>{
      this.shipsService.getFleetDetail(this.fleet2.id).subscribe(detail => this.ships2 = detail.ships);
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private getShips() {
    this.shipsService.getFleetDetail(this.fleet1.id).subscribe(detail => this.ships1 = detail.ships);
    this.shipsService.getFleetDetail(this.fleet2.id).subscribe(detail => this.ships2 = detail.ships);
  }
}
