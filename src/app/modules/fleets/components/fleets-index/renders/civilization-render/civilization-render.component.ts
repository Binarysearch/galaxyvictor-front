import { Component } from '@angular/core';
import { Fleet } from 'src/app/model/fleet';
import { RowCell, CellRenderer } from '@piros/table';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-civilization-render',
  templateUrl: './civilization-render.component.html',
  styleUrls: ['./civilization-render.component.css']
})
export class CivilizationRenderComponent implements CellRenderer<Fleet> {
  
  fleet: Fleet;

  constructor(
    private colorService: ColorService
  ) { }

  ptInit(cell: RowCell<Fleet>): void {
    this.fleet = cell.row;
  }
  
  get color(): string {
    return this.colorService.getCivilizationColorHex(this.fleet.civilization.id);
  }
}
