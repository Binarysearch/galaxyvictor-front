import { Injectable } from '@angular/core';
import { RecursiveIterable, Entity } from './render/renderer.interface';

@Injectable({
  providedIn: 'root'
})
export class BordersService {

  operations: number;

  constructor() { }

  generateValues(points: { x: number; y: number; r: number }[], width: number, height: number): BorderRect {
    this.operations = 0;

    const divisions = 16;

    const subdivisions = this.generateSubdivisions(points, width, height, divisions);

    //const valueGetter = (x, y) => this.getValueSubdivided(x, y, width, height, divisions, subdivisions);
    const valueGetter = (x, y) => this.getValue(x, y, points);

    
    console.log('Operations:', this.operations);
    return new BorderRect(-width, width, -height, height, 0, 9, 12, valueGetter, 1);
  }

  private generateSubdivisions(points: { x: number; y: number; r: number }[], width: number, height: number, divisions: number): { points: { x: number; y: number; r: number }[] }[][] {
    const result = [];

    points.forEach(p => {
      const x = Math.floor(divisions * p.x / width);
      const y = Math.floor(divisions * p.y / height);

      if (!result[y]) {
        result[y] = [];
      }

      if (!result[y][x]) {
        result[y][x] = { points: [] };
      }
      result[y][x].points.push(p);
    });

    return result;
  }

  private getValueSubdivided(x: number, y: number, width: number, height: number, divisions: number, pd: { points: { x: number; y: number; r: number }[] }[][]): number {
    let result = 0;

    const iY = Math.floor(divisions * y / height);
    const iX = Math.floor(divisions * x / width);
    
    const neighbourCoords = [
      { x: iX - 1, y: iY - 1 }, { x: iX, y: iY - 1 }, { x: iX + 1, y: iY - 1 },
      { x: iX - 1, y: iY }, { x: iX, y: iY }, { x: iX + 1, y: iY },
      { x: iX - 1, y: iY + 1 }, { x: iX, y: iY + 1 }, { x: iX + 1, y: iY + 1 }
    ];

    neighbourCoords.forEach(coords => {
      if (pd[coords.y] && pd[coords.y][coords.x]) {
        const subProblem = pd[coords.y][coords.x].points;
        result += this.getValue(x, y, subProblem)
      }
    });
    
    return result;
  }

  private getValue(x: number, y: number, points: { x: number; y: number; r: number }[]): number {
    let result = 0;

    points.forEach(p => {
      this.operations++;
      result += (p.r * p.r) / ((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y));
    });

    return result
  }
}


export class QuadTree {

  tl: QuadTree;
  tr: QuadTree;
  bl: QuadTree;
  br: QuadTree;

  constructor(
    private x1: number,
    private x2: number,
    private y1: number,
    private y2: number
  ) {
    
  }

  check(x: number, y: number, level: number, maxLevel: number): boolean {
    return this.isInside(x, y) && (level === maxLevel || this.checkChildren(x, y, level + 1, maxLevel));
  }

  add(x: number, y: number, level: number, maxLevel: number) {
    if (level < maxLevel) {
      const tl = this.tl || this.createTL();
      const tr = this.tr || this.createTR();
      const bl = this.bl || this.createBL();
      const br = this.br || this.createBR();

      if (tl.isInside(x, y)) {
        this.tl = this.tl || tl;
        this.tl.add(x, y, level + 1, maxLevel);
      }
      if (tr.isInside(x, y)) {
        this.tr = this.tr || tr;
        this.tr.add(x, y, level + 1, maxLevel);
      }
      if (bl.isInside(x, y)) {
        this.bl = this.bl || bl;
        this.bl.add(x, y, level + 1, maxLevel);
      }
      if (br.isInside(x, y)) {
        this.br = this.br || br;
        this.br.add(x, y, level + 1, maxLevel);
      }

    }
  }

  private checkChildren(x: number, y: number, level: number, maxLevel: number): boolean {
    return (this.tl && this.tl.check(x, y, level, maxLevel)) ||
           (this.tr && this.tr.check(x, y, level, maxLevel)) ||
           (this.bl && this.bl.check(x, y, level, maxLevel)) ||
           (this.br && this.br.check(x, y, level, maxLevel));
  }

  private isInside(x: number, y: number) {
    return x >= this.x1 && x < this.x2 && y >= this.y1 && y < this.y2;
  }

  private createTL(): QuadTree {
    return new QuadTree(
      this.x1,
      this.x1 + (this.x2 - this.x1) / 2,
      this.y1,
      this.y1 + (this.y2 - this.y1) / 2
    );
  }

  private createTR(): QuadTree {
    return new QuadTree(
      this.x1 + (this.x2 - this.x1) / 2,
      this.x2,
      this.y1,
      this.y1 + (this.y2 - this.y1) / 2
    );
  }

  private createBL(): QuadTree {
    return new QuadTree(
      this.x1,
      this.x1 + (this.x2 - this.x1) / 2,
      this.y1 + (this.y2 - this.y1) / 2,
      this.y2,
    );
  }

  private createBR(): QuadTree {
    return new QuadTree(
      this.x1 + (this.x2 - this.x1) / 2,
      this.x2,
      this.y1 + (this.y2 - this.y1) / 2,
      this.y2,
    );
  }

}

export class BorderPoint {
  x: number;
  y: number;
  value: number;
}

export class BorderRect implements Entity, RecursiveIterable<BorderRect> {

  private tl: BorderRect;
  private tr: BorderRect;
  private bl: BorderRect;
  private br: BorderRect;

  public tlp: BorderPoint;
  public trp: BorderPoint;
  public blp: BorderPoint;
  public brp: BorderPoint;

  value: number;

  constructor(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    depth: number,
    minDepth: number,
    maxDepth: number,
    valueGetter: (x: number, y: number) => number,
    threshold: number
  ) {
    //Calcular puntos
    this.tlp = { x: x1, y: y1, value: valueGetter.call(this, x1, y1) };
    this.trp = { x: x2, y: y1, value: valueGetter.call(this, x2, y1) };
    this.blp = { x: x1, y: y2, value: valueGetter.call(this, x1, y2) };
    this.brp = { x: x2, y: y2, value: valueGetter.call(this, x2, y2) };
    this.value = valueGetter.call(this, (x1 + x2) / 2, (y1 + y2) / 2);
    
    if (depth < maxDepth) {

      // Si la profundidad es menos q la profundidad minima
      // o hay puntos con el valor a los dos lados del limite
      // generar los 4 hijos
      if (depth < minDepth || this.inThreshold(threshold)) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        this.tl = new BorderRect(x1, mx, y1, my, depth + 1, minDepth, maxDepth, valueGetter, threshold);
        this.tr = new BorderRect(mx, x2, y1, my, depth + 1, minDepth, maxDepth, valueGetter, threshold);
        this.bl = new BorderRect(x1, mx, my, y2, depth + 1, minDepth, maxDepth, valueGetter, threshold);
        this.br = new BorderRect(mx, x2, my, y2, depth + 1, minDepth, maxDepth, valueGetter, threshold);
      }
    }
  }

  inThreshold(threshold: number): boolean {
    let beyondThreshold = 0;

    if (this.tlp.value > threshold) beyondThreshold++;
    if (this.trp.value > threshold) beyondThreshold++;
    if (this.blp.value > threshold) beyondThreshold++;
    if (this.brp.value > threshold) beyondThreshold++;
    if (this.value > threshold) beyondThreshold++;

    return beyondThreshold > 0 && beyondThreshold < 5;
  }

  public forEach(iterator: ((rect: BorderRect) => void)) {
    if (this.tl) {
      this.tl.forEach(iterator);
      this.tr.forEach(iterator);
      this.bl.forEach(iterator);
      this.br.forEach(iterator);
    } else {
      iterator.call(this, this);
    }
  }

  get id(): string {
    return '';
  }
}

