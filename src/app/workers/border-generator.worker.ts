/// <reference lib="webworker" />

function getValue(x: number, y: number, points: { x: number; y: number; r: number }[]): number {
  let result = 0;

  points.forEach(p => {
    result += (p.r * p.r) / ((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y));
  });

  return result
}

addEventListener('message', (event) => {
  const points = [];
  console.log(event);

  (<any>event.data).colonies.forEach(c => points.push({ x: c.planet.starSystem.x, y: c.planet.starSystem.y, r: 100 }));
  
  const valueGetter = (x, y) => getValue(x, y, points);
  
  const borders = new BorderRect(-60000, 60000, -60000, 60000, 0, 9, 12, valueGetter, 1);

  let result: Set<BorderRect> = new Set<BorderRect>();

  const chunksize = 1000;

  postMessage('START');

  let i = 0;
  borders.forEach(br => {
    if(br.value < 1) return;
    if (i == chunksize) {
      i = 0;

      postMessage(result);
      result = new Set<BorderRect>();
    }
    i++;
    result.add(br);
  });

  postMessage(result);
  postMessage('END');
});


export class BorderPoint {
  x: number;
  y: number;
  value: number;
}

export class BorderRect  {

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

