import { Injectable } from '@angular/core';
import { StarRendererService } from './render/star-renderer.service';
import { Entity, RenderContext, Renderer } from './render/renderer.interface';

interface IntersectingElement {
  x: number;
  y: number;
  element: Entity;
}

@Injectable({
  providedIn: 'root'
})
export class HoverService {

  private _hovered: Entity;

  constructor(private starRenderer: StarRendererService) {

  }

  public get hovered(): Entity {
    return this._hovered;
  }


  mouseMoved(x: number, y: number, context: RenderContext): void {
    const intersectingStars = this.getintersectingStars(x, y, context);

    const closest = this.getClosestElement(x, y, context, [intersectingStars]);

    this._hovered = closest;
  }

  getClosestElement(x: number, y: number, context: RenderContext, elements: IntersectingElement[][]): Entity {
    let minDist = 10000000;
    let closest = null;
    elements.forEach( e => {
      e.forEach(s => {
        const xx = s.x * context.camera.zoom / context.aspectRatio - x;
        const yy = s.y * context.camera.zoom - y;
        const dist = Math.sqrt(xx * xx + yy * yy);
        if (dist < minDist) {
          minDist = dist;
          closest = s.element;
        }
      });
    });

    return closest;
  }

  getintersectingStars(x: number, y: number, context: RenderContext) {
    return this.getIntersectingElements(x, y, context, this.starSystems, this.starRenderer);
  }

  getIntersectingElements(x: number, y: number, context: RenderContext, elements: Entity[], renderer: Renderer): IntersectingElement[] {
    const intersectingElements = [];

    elements.forEach(ss => {

      const scale = renderer.getRenderScale(ss, context.camera.zoom);
      const cx = ss.x - context.camera.x;
      const cy = ss.y - context.camera.y;
      const left = (cx - scale) * context.camera.zoom / context.aspectRatio;
      const right = (cx + scale) * context.camera.zoom / context.aspectRatio;
      const bottom = (cy - scale) * context.camera.zoom;
      const top = (cy + scale) * context.camera.zoom;

      if (x > left && x < right && y > bottom && y < top) {
        intersectingElements.push({element: ss, x: cx, y: cy});
      }
    });
    return intersectingElements;
  }

}