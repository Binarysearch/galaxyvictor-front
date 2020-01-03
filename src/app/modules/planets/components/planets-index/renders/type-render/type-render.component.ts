import { Component } from '@angular/core';
import { CellRenderer, RowCell } from '@piros/table';
import { Planet } from '../../../../../../model/planet';

@Component({
  selector: 'app-type-render',
  templateUrl: './type-render.component.html',
  styleUrls: ['./type-render.component.css']
})
export class TypeRenderComponent implements CellRenderer<Planet> {
  
  planet: Planet;

  constructor() { }

  ptInit(cell: RowCell<Planet>): void {
    this.planet = cell.row;
  }
}
