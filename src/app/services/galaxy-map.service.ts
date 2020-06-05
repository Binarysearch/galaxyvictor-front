import { Injectable } from '@angular/core';
import { MainRendererService } from './render/main-renderer.service';
import { RenderContext, Entity } from './render/renderer.interface';
import { Camera } from './render/camera';
import { HoverService } from './hover.service';
import { Store } from './data/store';
import { mergeMap, map } from 'rxjs/operators';
import { SessionState } from '../model/session.interface';
import { Observable, Subject } from 'rxjs';
import { Civilization } from '../model/civilization';
import { MapActionResolverService, MapAction } from './map-action-resolver.service';
import { GvApiService } from './gv-api.service';

@Injectable({
  providedIn: 'root'
})
export class GalaxyMapService {

  private onSelectEntity: Subject<Entity> = new Subject();
  private canvas: HTMLCanvasElement;
  private context: RenderContext = {
    gl: null,
    aspectRatio: 1.333,
    camera: new Camera()
  }

  private mouseDownX: number;
  private mouseDownY: number;

  private _mouseX: number;
  private _mouseY: number;

  private mouseDown: boolean;

  private mouseDownCameraX: number;
  private mouseDownCameraY: number;
  private selectedId: string;
  private galaxyId: string;


  constructor(
    private renderer: MainRendererService,
    private hoverService: HoverService,
    private api: GvApiService,
    private store: Store,
    private actionResolver: MapActionResolverService
  ){
    this.subscribeToStartingPosition();
    this.startAutosaveState();
  }

  private subscribeToStartingPosition() {
    this.api.isReady().subscribe(ready => {
      if (ready) {
        this.api.getSessionState().pipe(mergeMap(state => this.store.getCivilization().pipe(map(civ => ({ state: state, civilization: civ }))))).subscribe(result => {
          const sessionState: SessionState = result.state;
          const civilization: Civilization = result.civilization;
          
          let x = 0, y = 0, z = 0.00003, selected;
          if (sessionState.cameraX && sessionState.cameraY && sessionState.cameraZ) {
            x = sessionState.cameraX;
            y = sessionState.cameraY;
            z = sessionState.cameraZ;
            selected = sessionState.selectedId;
          }
          else if (civilization) {
            x = civilization.homeworld.x;
            y = civilization.homeworld.y;
            z = 0.5;
            selected = civilization.homeworld.id;
          }
          this.selectedId = selected;
          this.renderer.setSelectedId(this.selectedId);
          this.context.camera.setPosition(x, y, z);
        });

      }
    });
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const gl = this.canvas.getContext('webgl2');

    this.context.gl = <WebGLRenderingContext>gl;

    this.renderer.init(this.context);
    this.setupCanvasSize();
  }

  private setupCanvasSize() {
    const displayWidth  = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;

    if (this.canvas.width  !== displayWidth || this.canvas.height !== displayHeight) {
        this.canvas.width  = displayWidth;
        this.canvas.height = displayHeight;
    }

    this.renderer.setViewport(this.canvas.width, this.canvas.height);
  }

  onMouseWheel(event: MouseWheelEvent) {
    let x = this._mouseX / this.context.camera.zoom * this.context.aspectRatio + this.context.camera.x;
    let y = this._mouseY / this.context.camera.zoom + this.context.camera.y;

    if (this.hovered) {
      x = this.hovered.x;
      y = this.hovered.y;
    }

    if (event.deltaY < 0) {
      this.context.camera.zoomIn(x, y);
    } else {
      this.context.camera.zoomOut(x, y);
    }
  }

  onRightButtonMouseClick(event: MouseEvent) {
    if (this.posibleRightClickAction) {
      this.posibleRightClickAction.execute();
    }
  }

  onMouseClick(event: MouseEvent) {
    const dx = (this.mouseDownX - this._mouseX) * 100;
    const dy = (this.mouseDownY - this._mouseY) * 100;
    const epsilon = 2;
    const delta = dx * dx + dy * dy;
    if (delta > epsilon) {
      return;
    }
    this.selectedId = (this.hovered) ? this.hovered.id: null;
    this.renderer.setSelectedId(this.selectedId);
    this.onSelectEntity.next(this.selected);
  }

  onMouseDown(event: MouseEvent) {
    if (event.button === 2) {
      return;
    }
    this.mouseDown = true;
    this.mouseDownX = this._mouseX;
    this.mouseDownY = this._mouseY;
    this.mouseDownCameraX = this.context.camera.x;
    this.mouseDownCameraY = this.context.camera.y;
  }

  onMouseUp(event: MouseEvent) {
    this.mouseDown = false;
  }

  onMouseMove(event: MouseEvent) {
    const x = ((event.clientX - this.canvas.getBoundingClientRect().left) / this.canvas.width) * 2 - 1;
    const y = -(((event.clientY - this.canvas.getBoundingClientRect().top) / this.canvas.height) * 2 - 1);
    this.hoverService.mouseMoved(x, y, this.context);
    this._mouseX = x;
    this._mouseY = y;
    if (this.mouseDown) {
      const dx = (this.mouseDownX - this._mouseX) * 100;
      const dy = (this.mouseDownY - this._mouseY) * 100;
      const epsilon = 1;
      const delta = dx * dx + dy * dy;
      if (delta < epsilon) {
        return;
      }
      const offseX = (x - this.mouseDownX) / this.context.camera.zoom * this.context.aspectRatio;
      const offseY = (y - this.mouseDownY) / this.context.camera.zoom;
      this.context.camera.setPosition(
        this.mouseDownCameraX - offseX,
        this.mouseDownCameraY - offseY
      );
    }
  }

  onResize() {
    this.setupCanvasSize();
  }

  getContext(): RenderContext {
    return this.context;
  }

  get hovered(): Entity {
    return this.hoverService.hovered;
  }

  get selected(): Entity {
    return this.store.getEntity(this.selectedId);
  }
  
  select(id: string) {
    this.selectedId = id;
    this.renderer.setSelectedId(this.selectedId);
    this.onSelectEntity.next(this.selected);
  }
  
  selectAndGo(id: string) {
    this.select(id);
    if (this.selected.x && this.selected.y) {
      this.context.camera.setPosition(this.selected.x, this.selected.y, 0.5);
    }
  }

  public getOnSelectEntity(): Observable<Entity> {
    return this.onSelectEntity.asObservable();
  }

  public get posibleRightClickAction(): MapAction {
    return this.actionResolver.getPosibleAction(this.selected, this.hovered);
  }

  private startAutosaveState() {
    let interval;
    this.api.isReady().subscribe(ready => {
      if (ready) {
        let savedX: number;
        let savedY: number;
        let savedZ: number;
        let savedSelected: string;
        interval = setInterval(()=>{
          if (
            savedX !== this.context.camera.x ||
            savedY !== this.context.camera.y ||
            savedZ !== this.context.camera.zoom ||
            savedSelected !== this.selectedId
          ) {
            const newState = {
              cameraX: this.context.camera.x,
              cameraY: this.context.camera.y,
              cameraZ: this.context.camera.zoom,
              galaxyId: null,
              selectedId: this.selectedId
            };
            this.api.setSessionstate(newState).subscribe(()=>{
              savedX = newState.cameraX;
              savedY = newState.cameraY;
              savedZ = newState.cameraZ;
              savedSelected = newState.selectedId;
            });
          }
        }, 2500);
      } else {
        if(interval){
          clearInterval(interval);
          interval = null;
        }
      }
    });
  }
}
