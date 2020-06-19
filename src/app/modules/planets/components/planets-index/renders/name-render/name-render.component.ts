import { Component } from '@angular/core';
import { CellRenderer, RowCell } from '@piros/table';
import { Planet } from '../../../../../../model/planet';
import { GalaxyMapService } from 'src/app/services/galaxy-map.service';

@Component({
  selector: 'app-name-render',
  templateUrl: './name-render.component.html',
  styleUrls: ['./name-render.component.css']
})
export class NameRenderComponent implements CellRenderer<Planet> {
  
  planet: Planet;

  constructor(
    private map: GalaxyMapService
  ) { }

  ptInit(cell: RowCell<Planet>): void {
    this.planet = cell.row;
  }

  goToPlanet(){
    this.map.selectAndGo(this.planet);
  }
}
