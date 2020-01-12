import { Component, ElementRef, AfterViewInit, ViewChildren, QueryList, HostListener, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { DsConfig, TopbarPosition } from '@piros/dashboard';
import { ApiService } from '@piros/api';
import { GalaxyMapService } from './services/galaxy-map.service';
import { Store } from './services/data/store';
import { Civilization } from './model/civilization';
import { EventManagerService } from './services/events/event-manager.service';
import { GalaxyManagerService } from './services/data/galaxy-manager.service';
import { WindowManagerService } from './services/window-manager.service-abstract';
import { BordersService, QuadTree, BorderPoint, BorderRect } from './services/borders.service';

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
  width: number = 1024;
  height: number = 1024;
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
    this.points.push({ x: ev.x, y: ev.y, r: 50 });

    const rect: BorderRect = this.borderService.generateValues(this.points, 2048, 2048);

    this.cx.clearRect(0, 0, this.width, this.height);

    rect.iterate(r => {
      if (r.tlp.value < 1) return;
      const x1 = r.tlp.x;
      const y1 = r.tlp.y;
      const w = r.brp.x - x1;
      const h = r.brp.y - y1;
      this.cx.strokeRect(x1, y1, w, h);
    });
    

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
