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
    this.getShips();
    this.fleet.getChanges().pipe(takeUntil(this.destroyed)).subscribe(()=>{
      this.getShips();
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private getShips() {
    this.shipsService.getFleetDetail(this.fleet.id).subscribe(detail => this.ships = detail.ships);
  }

}
