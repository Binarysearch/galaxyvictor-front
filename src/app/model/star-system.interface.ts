import { Entity } from '../services/render/renderer.interface';

export interface StarSystem extends Entity {
    x: number;
    y: number;
    size: number;
    type: number;
}