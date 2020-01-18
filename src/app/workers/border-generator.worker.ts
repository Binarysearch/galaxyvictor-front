/// <reference lib="webworker" />



const BUFFER_TRIANGLE_COUNT = 10000;
const VERTICE_COMPONENT_COUNT = 6;
const TRIANGLE_COMPONENT_COUNT = 3 * VERTICE_COMPONENT_COUNT
const BUFFER_SIZE = BUFFER_TRIANGLE_COUNT * TRIANGLE_COMPONENT_COUNT;

function getPoint(x: number, y: number, civilizations: Map<string, Civilization>): Point {
  let resultValue = 0;
  let resultColor: { r: number; g: number; b: number; };
  let resultCivilizationId: string;

  civilizations.forEach(civ => {
    let civResult = 0;

    civ.points.forEach(p => {
      civResult += (p.r * p.r) / ((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y));
    });

    if (civResult > resultValue) {
      resultValue = civResult;
      resultColor = civ.color;
      resultCivilizationId = civ.civilizationId;
    }
  });

  return { x: x, y: y, r: resultColor.r, g: resultColor.g, b: resultColor.b, a: resultValue, civ: resultCivilizationId };
}

addEventListener('message', (event) => {
  const civilizations = new Map<string, Civilization>();

  const civColors: Map<string, Color> = (<any>event.data).civilizationColors;

  (<any>event.data).colonies.forEach(c => {
    if (!civilizations.has(c.civilization.id)) {
      civilizations.set(c.civilization.id, { civilizationId: c.civilization.id, points: [], color: civColors.get(c.civilization.id) } );
    }
    civilizations.get(c.civilization.id).points.push({ x: c.planet.starSystem.x, y: c.planet.starSystem.y, r: 100 });
  });
  
  const rectCollector: RectCollector = new RectCollector();

  postMessage('START');
  if (civilizations.size > 0) {
    calculateBorders(-60000, 60000, 60000, -60000, 0, 9, 14, civilizations, 1, rectCollector);
    rectCollector.sendBuffer();
  }
  postMessage('END');
  
});

function calculateBorders(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  depth: number,
  minDepth: number,
  maxDepth: number,
  civilizations: Map<string, Civilization>,
  threshold: number,
  collector: RectCollector
) {

  const tlp = getPoint(x1, y1, civilizations);
  const trp = getPoint(x2, y1, civilizations);
  const blp = getPoint(x1, y2, civilizations);
  const brp = getPoint(x2, y2, civilizations);
  const center = getPoint((x1 + x2) / 2, (y1 + y2) / 2, civilizations);

  //Calcular recursivamente
  if (depth < maxDepth) {

    let beyondThreshold = 0;
    const civs: Set<string> = new Set();

    if (tlp.a > threshold) beyondThreshold++;
    if (trp.a > threshold) beyondThreshold++;
    if (blp.a > threshold) beyondThreshold++;
    if (brp.a > threshold) beyondThreshold++;
    if (center.a > threshold) beyondThreshold++;

    civs.add(center.civ);
    civs.add(tlp.civ);
    civs.add(trp.civ);
    civs.add(blp.civ);
    civs.add(brp.civ);

    const inThreshold: boolean = beyondThreshold > 0 || civs.size > 1;


    // Si la profundidad es menos q la profundidad minima
    // o hay puntos con el valor a los dos lados del limite
    // generar los 4 hijos
    if (depth < minDepth || inThreshold) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      calculateBorders(x1, mx, y1, my, depth + 1, minDepth, maxDepth, civilizations, threshold, collector);
      calculateBorders(mx, x2, y1, my, depth + 1, minDepth, maxDepth, civilizations, threshold, collector);
      
      calculateBorders(x1, mx, my, y2, depth + 1, minDepth, maxDepth, civilizations, threshold, collector);
      calculateBorders(mx, x2, my, y2, depth + 1, minDepth, maxDepth, civilizations, threshold, collector);
    } else {
      if (
        center.a > threshold
      ) {
        collector.onNewRect({ tlp: tlp, trp: trp, blp: blp, brp: brp });
      }
    }
  } else {
    if (
      center.a > threshold
    ) {
      collector.onNewRect({ tlp: tlp, trp: trp, blp: blp, brp: brp });
    }
  }

}


class RectCollector {

  public buffer: TriangleBuffer;

  constructor() {
    this.buffer = new TriangleBuffer();
  }

  onNewRect(rect: Rect): void {

    this.buffer.addTriangle(rect.tlp, rect.trp, rect.blp);
    this.buffer.addTriangle(rect.blp, rect.trp, rect.brp);

    if (this.buffer.isFull()) {
      this.sendBuffer();
      this.buffer = new TriangleBuffer();
    }
  }

  sendBuffer() {
    postMessage({ data: this.buffer.data, triangleCount: this.buffer.index / TRIANGLE_COMPONENT_COUNT }, [this.buffer.data.buffer]);
  }
}

class TriangleBuffer {

  index: number;
  data: Float32Array;

  constructor() {
    this.index = 0;
    this.data = new Float32Array(BUFFER_SIZE);
  }
  
  addTriangle(a: Point, b: Point, c: Point) {
    this.data[this.index++] = a.x;
    this.data[this.index++] = a.y;
    this.data[this.index++] = a.r;
    this.data[this.index++] = a.g;
    this.data[this.index++] = a.b;
    this.data[this.index++] = Math.min(a.a / 10, 0.2);

    this.data[this.index++] = b.x;
    this.data[this.index++] = b.y;
    this.data[this.index++] = b.r;
    this.data[this.index++] = b.g;
    this.data[this.index++] = b.b;
    this.data[this.index++] = Math.min(b.a / 10, 0.2);

    this.data[this.index++] = c.x;
    this.data[this.index++] = c.y;
    this.data[this.index++] = c.r;
    this.data[this.index++] = c.g;
    this.data[this.index++] = c.b;
    this.data[this.index++] = Math.min(c.a / 10, 0.2);
  }

  isFull(): boolean {
    return this.index >= this.data.length;
  }
}

interface Civilization {
  points: { x: number; y: number; r: number; }[];
  civilizationId: string;
  color: Color;
}

interface Color {
  r: number;
  g: number;
  b: number;
}

interface Point {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
  civ: string;
}

interface Rect {

  tlp: Point;
  trp: Point;
  blp: Point;
  brp: Point;
  
}