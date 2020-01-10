import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BordersService {

  operations: number;

  constructor() { }

  generateValues(points: { x: number; y: number; r: number }[], width: number, height: number): number[][] {
    this.operations = 0;
    const result = new Array(height);

    const divisions = Math.log2(width) * 2;

    const subdivisions = this.generateSubdivisions(points, width, height, divisions);

    for (let y = 0; y < height; y++) {
      const fila = new Array(width);

      for (let x = 0; x < width; x++) {
        fila[x] = this.getValueSubdivided(x, y, width, height, divisions, subdivisions);
      }

      result[y] = fila;
    }
    
    console.log('Operations:', this.operations);
    return result;
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