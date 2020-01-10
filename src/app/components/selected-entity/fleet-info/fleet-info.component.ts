import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Fleet } from 'src/app/model/fleet';
import { ShipsService } from 'src/app/services/data/getters/ships.service';
import { Ship } from 'src/app/model/ship';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-fleet-info',
  templateUrl: './fleet-info.component.html',
  styleUrls: ['./fleet-info.component.css']
})
export class FleetInfoComponent implements OnInit, OnDestroy {

  private destroyed: Subject<void> = new Subject();
  private _fleet: Fleet;

  @Input() set fleet(fleet: Fleet){
    this._fleet = fleet;
    this._fleet.unSelectedShips = null;
    this.getShips();
  }

  get fleet(): Fleet {
    return this._fleet;
  }

  ships: Ship[] = [];
  
  constructor(
    private shipsService: ShipsService
  ) { }

  ngOnInit() {
    this.fleet.getChanges().pipe(takeUntil(this.destroyed)).subscribe(()=>{
      this.getShips();
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private getShips() {
    this.shipsService.getFleetDetail(this.fleet.id).subscribe(detail => {
      this.ships = detail.ships;
      const newShips = new Set(this.ships.map(s => s.id));
      if (this._fleet.unSelectedShips) {
        this._fleet.unSelectedShips.forEach(s => {
          if (!newShips.has(s)) {
            this._fleet.unSelectedShips.delete(s);
          }
        });
      } else {
        this._fleet.unSelectedShips = new Set();
      }
    });
  }

  isSelected(ship: Ship): boolean {
    return !this.unSelectedShips.has(ship.id);
  }

  toggleSelected(ship: Ship) {
    if (this.unSelectedShips.has(ship.id)) {
      this.unSelectedShips.delete(ship.id);
    } else {
      this.unSelectedShips.add(ship.id);
    }
  }

  get unSelectedShips(): Set<string> {
    return this._fleet.unSelectedShips;
  }
}
