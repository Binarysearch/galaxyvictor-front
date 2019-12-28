import { Injectable } from '@angular/core';
import { Store } from '../data/store';
import { MIN_ZOOM_TO_VIEW_STAR_NAMES } from '../../galaxy-constants';
import { Camera } from '../render/camera';
import { BehaviorSubject, Observable } from 'rxjs';
import { CameraChangeRecorder } from './camera-change-recorder';
import { RenderContext } from '../render/renderer.interface';
import { StarSystem } from '../../model/star-system';
import { StarRendererService } from '../render/star-renderer.service';

export interface VisibleStar {
  x: number;
  y: number;
  star: StarSystem;
}

@Injectable({
  providedIn: 'root'
})
export class VisibleStarsService {
  
  private viewport: { w: number; h: number; };
  private aspectRatio: number;
  private camera: Camera;
  private cameraChanges: CameraChangeRecorder;

  private starSystems: StarSystem[] = [];
  private viewportStarSystems: BehaviorSubject<StarSystem[]> = new BehaviorSubject([]);
  private visibleStarSystems: BehaviorSubject<VisibleStar[]> = new BehaviorSubject([]);
  private starsChanged: boolean;

  constructor(
    private store: Store,
    private starRenderer: StarRendererService
  ) {

    this.store.getStarSystems().subscribe(stars => {
      this.starSystems = stars;
      this.starsChanged = true;
    });
    
  }

  public setup(context: RenderContext): void {
    this.camera = context.camera;
    this.cameraChanges = new CameraChangeRecorder(this.camera);
  }

  public setViewport(viewport: { w: number; h: number; }) {
    this.viewport = viewport;
    this.aspectRatio = viewport.w / viewport.h;
  }

  public recalculate(): void {
    if (this.cameraChanges.changed() || this.starsChanged) {
      const viewportStars = this.starSystems.filter(ss => {
        return this.isVisible(ss);
      });
      
      this.viewportStarSystems.next(viewportStars);
      this.starsChanged = false;
    }

    if(this.camera.zoom < MIN_ZOOM_TO_VIEW_STAR_NAMES){
      this.visibleStarSystems.next([]);
    } else {
      const visibleStars = this.viewportStarSystems.value.map(ss => {
        return ({ x: this.getX(ss), y: this.getY(ss), star: ss });
      });

      this.visibleStarSystems.next(visibleStars);
    }
  }

  private isVisible(ss: StarSystem): boolean {
    const camera = this.camera;
    const x = (ss.x - camera.x) * camera.zoom / this.aspectRatio;
    const y = (ss.y - camera.y) * camera.zoom;
    return x > -2 && x < 2 && y > -2 && y < 2;
  }

  private getX(ss: StarSystem): number {    
    const camera = this.camera;
    return ((ss.x - camera.x) * camera.zoom / this.aspectRatio + 1) * this.viewport.w / 2;
  }

  private getY(ss: StarSystem): number {    
    const camera = this.camera;
    return (1 - (ss.y - camera.y - this.starRenderer.getRenderScale(ss, camera.zoom)) * camera.zoom) * this.viewport.h / 2;
  }

  public getVisibleStars(): Observable<VisibleStar[]> {
    return this.visibleStarSystems.asObservable();
  }

  public getViewportStars(): Observable<StarSystem[]> {
    return this.viewportStarSystems.asObservable();
  }

}
