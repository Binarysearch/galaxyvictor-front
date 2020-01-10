import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, HostListener, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { DsConfig, TopbarPosition } from '@piros/dashboard';
import { ApiService } from '@piros/api';
import { GalaxyMapService } from './services/galaxy-map.service';
import { Store } from './services/data/store';
import { Civilization } from './model/civilization';
import { EventManagerService } from './services/events/event-manager.service';
import { GalaxyManagerService } from './services/data/galaxy-manager.service';
import { WindowManagerService } from './services/window-manager.service-abstract';
import { BordersService, QuadTree } from './services/borders.service';

export interface AppRoute {
  path: string;
  title: string;
  faIcon?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit { 
  
  @ViewChild('canvas', { static: true }) public canvas: ElementRef;

  points: { x: number; y: number; r: number }[] = [];

  children: Set<QuadTree> = new Set();
  maxLevel: number = 8;
  width: number = 512;
  height: number = 512;
  cantidad: number = 0;

  root: QuadTree;
  inside: boolean;
  cx: CanvasRenderingContext2D;

  constructor(
    private borderService: BordersService
  ){ 
    this.root = new QuadTree(0, this.width, 0, this.height);
    
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

  }

  clickContainer(ev: MouseEvent) {
    this.points.push({ x: ev.x, y: ev.y, r: 10 });

    const values: number[][] = this.borderService.generateValues(this.points, 512, 512);

    this.cx.clearRect(0, 0, this.width, this.height);

    values.forEach((fila, y) => fila.forEach((value, x) => {
      if (value > 1) {
        this.addPosition(x, y);
        this.cx.fillRect(x, y, 1, 1);
      }
    }));
    

  }

  addPosition(x, y) {
    this.root.add(x, y, 0, this.maxLevel);
    this.children = new Set();
    this.addChildren(this.root, 1);
  }

  mouseMove(ev: MouseEvent){
    this.inside = this.root.check(ev.x, ev.y, 0, this.maxLevel);
  }

  addChildren(e: QuadTree, level: number){
    if (this.maxLevel === level) this.children.add(e);
    if (e.tl) this.addChildren(e.tl, level + 1);
    if (e.tr) this.addChildren(e.tr, level + 1);
    if (e.bl) this.addChildren(e.bl, level + 1);
    if (e.br) this.addChildren(e.br, level + 1);
  }

}
