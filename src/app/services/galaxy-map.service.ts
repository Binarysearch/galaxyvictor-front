import { Injectable } from '@angular/core';
import { MainRendererService } from './render/main-renderer.service';
import { RenderContext, Entity } from './render/renderer.interface';
import { Camera } from './render/camera';
import { HoverService } from './hover.service';
import { ApiService, SocketStatus } from '@piros/api';
import { Store } from './data/store';
import { first } from 'rxjs/operators';
import { SessionState } from '../model/session.interface';

@Injectable({
  providedIn: 'root'
})
export class GalaxyMapService {

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
    private api: ApiService,
    private store: Store
  ){
    this.api.getSessionState<SessionState>().subscribe(state => {
      this.context.camera.setPosition(state.cameraX, state.cameraY, state.cameraZ);
      this.selectedId = state.selectedId;
      this.renderer.setSelectedId(this.selectedId);
    });
    this.startAutosaveState();
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

    if (this.selected) {
      x = this.selected.x;
      y = this.selected.y;
    } else if (this.hovered) {
      x = this.hovered.x;
      y = this.hovered.y;
    }

    if (event.deltaY < 0) {
      this.context.camera.zoomIn(x, y);
    } else {
      this.context.camera.zoomOut(x, y);
    }
  }

  onMouseClick(event: any) {
    const dx = (this.mouseDownX - this._mouseX) * 100;
    const dy = (this.mouseDownY - this._mouseY) * 100;
    const epsilon = 2;
    const delta = dx * dx + dy * dy;
    if (delta > epsilon) {
      return;
    }
    this.selectedId = (this.hovered) ? this.hovered.id: null;
    this.renderer.setSelectedId(this.selectedId);
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
      this.context.camera.x = this.mouseDownCameraX - offseX;
      this.context.camera.y = this.mouseDownCameraY - offseY;
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

  private startAutosaveState() {
    let interval;
    this.api.getStatus().pipe(first(s => s === SocketStatus.SESSION_STARTED)).subscribe(ready => {
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
            this.api.request('set-session-state', newState).subscribe(()=>{
              savedX = newState.cameraX;
              savedY = newState.cameraY;
              savedZ = newState.cameraZ;
              savedSelected = newState.selectedId;
            });
          }
        }, 500);
      } else {
        if(interval){
          clearInterval(interval);
          interval = null;
        }
      }
    });
  }
}
