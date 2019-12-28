import { Injectable } from '@angular/core';

export interface Color {
  r: number;
  g: number;
  b: number;
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }

  public getCivilizationColor(civilizationId: string): Color {
    return { r: 0, g: 1, b: 0 }
  }

  public getCivilizationColorHex(civilizationId: string): string {
    const {r, g, b} = this.getCivilizationColor(civilizationId);
    const color = "#" + ((1 << 24) + (r*255 << 16) + (g*255 << 8) + b*255).toString(16).slice(1);
    console.log(color);
    return color;
  }

}
