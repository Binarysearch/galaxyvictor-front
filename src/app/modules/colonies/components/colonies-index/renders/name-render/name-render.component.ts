import { Component } from '@angular/core';
import { CellRenderer, RowCell } from '@piros/table';
import { GalaxyMapService } from 'src/app/services/galaxy-map.service';
import { Colony } from 'src/app/model/colony';

@Component({
  selector: 'app-name-render',
  templateUrl: './name-render.component.html',
  styleUrls: ['./name-render.component.css']
})
export class NameRenderComponent implements CellRenderer<Colony> {
  
  colony: Colony;

  constructor(
    private map: GalaxyMapService
  ) { }

  ptInit(cell: RowCell<Colony>): void {
    this.colony = cell.row;
  }

  goToColony(){
    this.map.selectAndGo(this.colony.planet);
  }
}
