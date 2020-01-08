import { Component, OnInit } from '@angular/core';
import { Fleet } from '../../../../model/fleet';

@Component({
  selector: 'app-fleet-exchange-window',
  templateUrl: './fleet-exchange-window.component.html',
  styleUrls: ['./fleet-exchange-window.component.css']
})
export class FleetExchangeWindowComponent implements OnInit {
  
  fleet1: Fleet;
  fleet2: Fleet;

  constructor() { }

  ngOnInit() {
  }

  setFleets(fleet1: Fleet, fleet2: Fleet) {
    this.fleet1 = fleet1;
    this.fleet2 = fleet2;
  }
}
