import { Component, OnInit, Input } from '@angular/core';
import { StarSystem } from '../../../model/star-system';
import { Fleet } from 'src/app/model/fleet';

@Component({
  selector: 'app-fleet-info',
  templateUrl: './fleet-info.component.html',
  styleUrls: ['./fleet-info.component.css']
})
export class FleetInfoComponent implements OnInit {

  @Input() fleet: Fleet;
  
  constructor() { }

  ngOnInit() {
  }

}
