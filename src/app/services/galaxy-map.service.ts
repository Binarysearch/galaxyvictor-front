import { Injectable } from '@angular/core';
import { MainRendererService } from './render/main-renderer.service';
import { RenderContext } from './render/renderer.interface';
import { Camera } from './render/camera.class';

@Injectable({
  providedIn: 'root'
})
export class GalaxyMapService {

  private canvas: HTMLCanvasElement;
  private context: RenderContext

  private mouseDownX: number;
  private mouseDownY: number;

  private _mouseX: number;
  private _mouseY: number;

  private mouseDown: boolean;

  private mouseDownCameraX: number;
  private mouseDownCameraY: number;


  constructor(
    private renderer: MainRendererService
  ){
    setInterval(()=>{
      if(this.context){
        this.context.camera.update();
      }
    }, 30);
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const gl = this.canvas.getContext('webgl2');

    this.context = {
      gl: <WebGLRenderingContext>gl,
      aspectRatio: 1.333,
      camera: new Camera()
    };

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
    console.log('MOUSE CLICK', this._mouseX, this._mouseY);
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
}
