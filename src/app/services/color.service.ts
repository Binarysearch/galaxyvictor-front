import { Injectable } from '@angular/core';
import { CivilizationsService } from './data/civilizations.service';

export interface Color {
  r: number;
  g: number;
  b: number;
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private civilizationId: string;

  constructor(
    private civilizationsService: CivilizationsService
  ) {
    this.civilizationsService.getCivilization().subscribe(
      civilization => {
        
        if (civilization) {
          this.civilizationId = civilization.id;
        } else {
          this.civilizationId = null;
        }
      }
    );
  }

  public getCivilizationColor(civilizationId: string): Color {
    if (this.civilizationId === civilizationId) {
      return { r: 0, g: 1, b: 0 };
    } else {
      return { r: 1, g: 0, b: 0 };
    }
  }

  public getCivilizationColorHex(civilizationId: string): string {
    const {r, g, b} = this.getCivilizationColor(civilizationId);
    const color = "#" + ((1 << 24) + (r*255 << 16) + (g*255 << 8) + b*255).toString(16).slice(1);
    return color;
  }

}
