import { Component, OnInit } from '@angular/core';
import { GalaxyMapService } from 'src/app/services/galaxy-map.service';
import { MapAction } from 'src/app/services/map-action-resolver.service';

@Component({
  selector: 'app-hovered-info',
  templateUrl: './hovered-info.component.html',
  styleUrls: ['./hovered-info.component.css']
})
export class HoveredInfoComponent implements OnInit {

  constructor(
    private map: GalaxyMapService
  ) { }

  ngOnInit() {
    
  }

  get action(): MapAction {
    return this.map.posibleRightClickAction;
  }


}
