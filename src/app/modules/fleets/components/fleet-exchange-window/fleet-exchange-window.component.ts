import { Component, OnInit, Input } from '@angular/core';
import { Fleet } from '../../../../model/fleet';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShipsService } from '../../../../services/data/getters/ships.service';
import { Ship } from '../../../../model/ship';
import { WindowManagerService } from 'src/app/services/window-manager.service-abstract';
import { TransferShipsDto } from '../../../../dto/transfer-ships-dto';

@Component({
  selector: 'app-fleet-exchange-window',
  templateUrl: './fleet-exchange-window.component.html',
  styleUrls: ['./fleet-exchange-window.component.css']
})
export class FleetExchangeWindowComponent implements OnInit {
  
  private destroyed: Subject<void> = new Subject();

  @Input() fleet1: Fleet;
  @Input() fleet2: Fleet;
  
  ships1: Set<Ship> = new Set();
  ships2: Set<Ship> = new Set();

  constructor(
    private shipsService: ShipsService,
    private windowManager: WindowManagerService
  ) { }

  ngOnInit() {
    this.getShips();
    this.fleet1.getChanges().pipe(takeUntil(this.destroyed)).subscribe(()=>{
      this.getShips1();
    });
    this.fleet2.getChanges().pipe(takeUntil(this.destroyed)).subscribe(()=>{
      this.getShips2();
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  transferShip(ship: Ship): void {
    if (this.ships1.has(ship)) {
      this.ships1.delete(ship);
      this.ships2.add(ship);
    } else {
      this.ships2.delete(ship);
      this.ships1.add(ship);
    }
  }

  private getShips() {
    this.getShips1();
    this.getShips2();
  }

  private getShips2() {
    this.shipsService.getFleetDetail(this.fleet2.id).subscribe(detail => this.ships2 = new Set(detail.ships));
  }

  private getShips1() {
    this.shipsService.getFleetDetail(this.fleet1.id).subscribe(detail => this.ships1 = new Set(detail.ships));
  }

  accept() {
    const dto: TransferShipsDto = {
      fleet1: this.fleet1.id,
      fleet2: this.fleet2.id,
      ships1: Array.from(this.ships1).map(s => s.id),
      ships2: Array.from(this.ships2).map(s => s.id)
    }
    this.shipsService.transferShips(dto).subscribe(() => {
      this.windowManager.closeAll();
    });
  }

  cancel() {
    this.windowManager.closeAll();
  }
}
