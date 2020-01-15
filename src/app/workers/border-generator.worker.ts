/// <reference lib="webworker" />

function getValue(x: number, y: number, civilizations: Map<string, { points: { x: number; y: number; r: number; }[]; civilizationId: string }>): { civilization: string; value: number } {
  let resultValue = 0;
  let resultCivilization;

  civilizations.forEach(civ => {
    let civResult = 0;

    civ.points.forEach(p => {
      civResult += (p.r * p.r) / ((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y));
    });

    if (civResult > resultValue) {
      resultValue = civResult;
      resultCivilization = civ.civilizationId;
    }
  });

  return { civilization: resultCivilization, value: resultValue };
}

addEventListener('message', (event) => {
  const civilizations = new Map<string, { points: { x: number; y: number; r: number; }[]; civilizationId: string }>();

  (<any>event.data).colonies.forEach(c => {
    if (!civilizations.has(c.civilization.id)) {
      civilizations.set(c.civilization.id, { civilizationId: c.civilization.id, points: [] } );
    }
    civilizations.get(c.civilization.id).points.push({ x: c.planet.starSystem.x, y: c.planet.starSystem.y, r: 100 });
  });
  
  console.log(civilizations.values());
  const valueGetter = (x, y) => getValue(x, y, civilizations);
  
  const borders = new BorderRect(-60000, 60000, -60000, 60000, 0, 9, 16, valueGetter, 1);

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
  data: {
    value: number;
    civilization: string;
  };
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
  civilization: string;

  constructor(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    depth: number,
    minDepth: number,
    maxDepth: number,
    valueGetter: (x: number, y: number) => { civilization: string; value: number },
    threshold: number
  ) {
    //Calcular puntos
    this.tlp = { x: x1, y: y1, data: valueGetter.call(this, x1, y1) };
    this.trp = { x: x2, y: y1, data: valueGetter.call(this, x2, y1) };
    this.blp = { x: x1, y: y2, data: valueGetter.call(this, x1, y2) };
    this.brp = { x: x2, y: y2, data: valueGetter.call(this, x2, y2) };
    const result = valueGetter.call(this, (x1 + x2) / 2, (y1 + y2) / 2);
    this.value = result.value
    this.civilization = result.civilization;
    
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
    const civs: Set<string> = new Set();

    if (this.tlp.data.value > threshold) beyondThreshold++;
    if (this.trp.data.value > threshold) beyondThreshold++;
    if (this.blp.data.value > threshold) beyondThreshold++;
    if (this.brp.data.value > threshold) beyondThreshold++;
    if (this.value > threshold) beyondThreshold++;

    civs.add(this.civilization);
    civs.add(this.tlp.data.civilization);
    civs.add(this.trp.data.civilization);
    civs.add(this.blp.data.civilization);
    civs.add(this.brp.data.civilization);

    return beyondThreshold > 0 && beyondThreshold < 5 || civs.size > 1;
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

