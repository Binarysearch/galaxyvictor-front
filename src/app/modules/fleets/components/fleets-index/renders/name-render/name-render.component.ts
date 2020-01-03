import { Component } from '@angular/core';
import { CellRenderer, RowCell } from '@piros/table';
import { Fleet } from '../../../../../../model/fleet';
import { GalaxyMapService } from 'src/app/services/galaxy-map.service';

@Component({
  selector: 'app-name-render',
  templateUrl: './name-render.component.html',
  styleUrls: ['./name-render.component.css']
})
export class NameRenderComponent implements CellRenderer<Fleet> {
  
  fleet: Fleet;

  constructor(
    private map: GalaxyMapService
  ) { }

  ptInit(cell: RowCell<Fleet>): void {
    this.fleet = cell.row;
  }

  goToFleet(){
    this.map.selectAndGo(this.fleet.id);
  }
}
