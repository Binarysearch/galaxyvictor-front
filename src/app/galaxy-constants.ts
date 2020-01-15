import { StarType, StarSize } from './model/star-system';
import { PlanetSize, PlanetType } from './model/planet';

export const STAR_COLORS = [
  {r: 1, g: 0, b: 0}, // red
  {r: 1, g: 1, b: 0}, // yellow
  {r: 0, g: 0, b: 1}, // blue
  {r: 1, g: 0.5, b: 0}, // orange
  {r: 1, g: 1, b: 1} // white
];

export const STAR_TYPES: StarType[] = [
  { id: 1, name: 'Roja', description: '', color: { r: 1, g: 0, b: 0 }, colorHex: '#ff0000' },
  { id: 2, name: 'Amarilla', description: '', color: { r: 1, g: 1, b: 0 }, colorHex: '#ffff00' },
  { id: 3, name: 'Azul', description: '', color: { r: 0, g: 0, b: 1 }, colorHex: '#0000ff' },
  { id: 4, name: 'Naranja', description: '', color: { r: 1, g: 0.5, b: 0 }, colorHex: '#ff8800' },
  { id: 5, name: 'Blanca', description: '', color: { r: 1, g: 1, b: 1 }, colorHex: '#ffffff' }
];

export const STAR_SIZES: StarSize[] = [
  { id: 1, name: 'Enana', description: '' },
  { id: 2, name: 'Pequeña', description: '' },
  { id: 3, name: 'Mediana', description: '' },
  { id: 4, name: 'Grande', description: '' },
  { id: 5, name: 'Gigante', description: '' }
];

export const PLANET_COLORS = [
  {r: 1, g: 0, b: 0},    // volcanic
  {r: 1, g: 1, b: 1},    // barren
  {r: 1, g: 0.3, b: 0.3}, // iron
  {r: 0.2, g: 0.2, b: 0.2}, // carbonic
  {r: 0.8, g: 0.8, b: 0.3}, // desert
  {r: 1, g: 1, b: 1.3},  // ice
  {r: 1, g: 1, b: 0.4},  // arid
  {r: 0.6, g: 0.6, b: 1}, // tundra
  {r: 0.7, g: 0.7, b: 2}, // ocean
  {r: 0.0, g: 0.8, b: 0.3}, // terran
  {r: 0.2, g: 2.2, b: 0.2}, // superterran
];

export const PLANET_TYPES: PlanetType[] = [
  { id: 1, name: 'Volcanico', description: '', color: {r: 1, g: 0, b: 0}, colorHex: '#ff0000' },
  { id: 2, name: 'Esteril', description: '', color: {r: 1, g: 1, b: 1}, colorHex: '#aaaaaa' },
  { id: 3, name: 'Ferreo', description: '', color: {r: 1, g: 0.3, b: 0.3}, colorHex: '#ff6060' },
  { id: 4, name: 'Carbonico', description: '', color: {r: 0.2, g: 0.2, b: 0.2}, colorHex: '#0f0f0f' },
  { id: 5, name: 'Desertico', description: '', color: {r: 0.8, g: 0.8, b: 0.3}, colorHex: '#888808' },
  { id: 6, name: 'Helado', description: '', color: {r: 1, g: 1, b: 1.3}, colorHex: '#8888ff' },
  { id: 7, name: 'Arido', description: '', color: {r: 1, g: 1, b: 0.4}, colorHex: '#aaaa40' },
  { id: 8, name: 'Tundra', description: '', color: {r: 0.6, g: 0.6, b: 1}, colorHex: '#4444ff' },
  { id: 9, name: 'Oceanico', description: '', color: {r: 0.7, g: 0.7, b: 2}, colorHex: '#2222ff' },
  { id: 10, name: 'Terrestre', description: '', color: {r: 0.0, g: 0.8, b: 0.3}, colorHex: '#009930' },
  { id: 11, name: 'Gaia', description: '', color: {r: 0.2, g: 2.2, b: 0.2}, colorHex: '#04ff04' }
];

export const PLANET_SIZES: PlanetSize[] = [
  { id: 1, name: 'Enano', description: '' },
  { id: 2, name: 'Pequeño', description: '' },
  { id: 3, name: 'Mediano', description: '' },
  { id: 4, name: 'Grande', description: '' },
  { id: 5, name: 'Gigante', description: '' }
];

// Camera constants
export const MIN_ZOOM_TO_VIEW_COLONIES = 0.01;
export const MIN_ZOOM_TO_VIEW_PLANETS = 0.01;
export const MIN_ZOOM_TO_VIEW_PLANET_NAMES = 0.2;

export const MIN_ZOOM_TO_VIEW_STAR_NAMES = 0.001;

// Rotation speeds
export const PLANET_ROTATION_SPEED_MULT = 0.01;
export const FLEET_ROTATION_SPEED_MULT = 0.2;


// Render sizes
export const PLANET_RENDER_SCALE_ZI_SI = 0.01; // Zoom and size independent component
export const PLANET_RENDER_SCALE_ZI = 0.0005; // Zoom independent component
export const PLANET_RENDER_SCALE_ZD = 0.0002; // Zoom dependent component
export const PLANET_ORBIT_SCALE_MULTIPLIER = 0.1; // Distance to star

export const STAR_RENDER_SCALE_ZI_SI = 0.03; // Zoom and size independent
export const STAR_RENDER_SCALE_ZI = 0.003; // Zoom independent component
export const STAR_RENDER_SCALE_ZD = 0.01; // Zoom dependent component
