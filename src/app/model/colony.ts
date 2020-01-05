import { Planet } from './planet';
import { Civilization } from './civilization';
import { Entity } from '../services/render/renderer.interface';

export class Colony implements Entity {

    constructor(
        public id: string,
        public planet: Planet,
        public civilization: Civilization
    ){

    }

    get x(): number {
        return this.planet.x;
    }

    get y(): number {
        return this.planet.y;
    }

    get name(): string {
        return this.planet.name;
    }
}