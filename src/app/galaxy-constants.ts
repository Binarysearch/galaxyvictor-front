export const STAR_COLORS = [
  {r: 1, g: 0, b: 0}, // red
  {r: 1, g: 1, b: 0}, // yellow
  {r: 0, g: 0, b: 1}, // blue
  {r: 1, g: 0.5, b: 0}, // orange
  {r: 1, g: 1, b: 1} // white
];

export const STAR_TYPES = [
  'Roja',
  'Amarilla',
  'Azul',
  'Naranja',
  'Blanca'
];

export const STAR_SIZES = [
  'Enana',
  'Pequeña',
  'Mediana',
  'Grande',
  'Gigante'
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

export const PLANET_TYPES = [
  'Volcanico',
  'Esteril',
  'Ferreo',
  'Carbonico',
  'Desertico',
  'Helado',
  'Arido',
  'Tundra',
  'Oceanico',
  'Terrestre',
  'Gaia'
];

export const PLANET_SIZES = [
  'Enano',
  'Pequeño',
  'Mediano',
  'Grande',
  'Gigante'
];

// Camera constants
export const MIN_ZOOM_TO_VIEW_PLANETS = 0.01;

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
