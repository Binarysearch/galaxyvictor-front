import { Component, OnInit, Input } from '@angular/core';
import { Planet } from 'src/app/model/planet';
import { StarSystem } from 'src/app/model/star-system';
import { GalaxyMapService } from 'src/app/services/galaxy-map.service';

@Component({
  selector: 'app-planet-info',
  templateUrl: './planet-info.component.html',
  styleUrls: ['./planet-info.component.css']
})
export class PlanetInfoComponent implements OnInit {

  @Input() planet: Planet;
  
  constructor(
    private map: GalaxyMapService
  ) { }

  ngOnInit() {
  }

  selectStar(starSystem: StarSystem){
    this.map.select(starSystem.id);
  }
}
