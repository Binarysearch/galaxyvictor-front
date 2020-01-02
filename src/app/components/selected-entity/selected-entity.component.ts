import { Component, OnInit } from '@angular/core';
import { Entity } from '../../services/render/renderer.interface';
import { GalaxyMapService } from '../../services/galaxy-map.service';
import { StarSystem } from '../../model/star-system';
import { Fleet } from 'src/app/model/fleet';
import { Planet } from 'src/app/model/planet';

@Component({
  selector: 'app-selected-entity',
  templateUrl: './selected-entity.component.html',
  styleUrls: ['./selected-entity.component.css']
})
export class SelectedEntityComponent implements OnInit {

  constructor(
    private map: GalaxyMapService
  ) { }

  ngOnInit() {
  }

  get selected(): Entity {
    return this.map.selected;
  }

  get isStarSystem(): boolean {
    return this.selected instanceof StarSystem;
  }

  get isPlanet(): boolean {
    return this.selected instanceof Planet;
  }

  get isFleet(): boolean {
    return this.selected instanceof Fleet;
  }

  get title(): string {
    if (this.isFleet) {
      return 'Flota';
    } else if (this.isStarSystem) {
      return 'Sistema estelar';
    } else if (this.isPlanet) {
      return 'Planeta';
    } else {
      return 'Desconocido';
    }
  }
}
