import { Component, OnInit, Input } from '@angular/core';
import { Fleet } from 'src/app/model/fleet';
import { ShipsService } from 'src/app/services/data/getters/ships.service';
import { Ship } from 'src/app/model/ship';

@Component({
  selector: 'app-fleet-info',
  templateUrl: './fleet-info.component.html',
  styleUrls: ['./fleet-info.component.css']
})
export class FleetInfoComponent implements OnInit {

  @Input() fleet: Fleet;

  ships: Ship[] = [];
  
  constructor(
    private shipsService: ShipsService
  ) { }

  ngOnInit() {
    this.shipsService.getFleetDetail(this.fleet.id).subscribe(detail => this.ships = detail.ships);
  }

}
