import { Component } from '@angular/core';
import { CellRenderer, RowCell } from '@piros/table';
import { Planet } from '../../../../../../model/planet';

@Component({
  selector: 'app-size-render',
  templateUrl: './size-render.component.html',
  styleUrls: ['./size-render.component.css']
})
export class SizeRenderComponent implements CellRenderer<Planet> {
  
  planet: Planet;

  constructor() { }

  ptInit(cell: RowCell<Planet>): void {
    this.planet = cell.row;
  }
}
