import { Entity } from '../services/render/renderer.interface';
import { Fleet } from './fleet';
import { Planet } from './planet';

export interface StarType {
    id: number;
    name: string;
    description: string;
    color: { r: number; g: number; b: number };
    colorHex: string;
}

export interface StarSize {
    id: number;
    name: string;
    description: string;
}

export class StarSystem implements Entity {

    public incomingFleets: Set<Fleet> = new Set();
    public orbitingFleets: Set<Fleet> = new Set();
    public planets: Set<Planet> = new Set();

    constructor(
        public id: string,
        public name: string,
        public x: number,
        public y: number,
        public size: StarSize,
        public type: StarType
    ) {

    }

    public addIncomingFleet(fleet: Fleet) {
        this.incomingFleets.add(fleet);
    }

    public removeIncomingFleet(fleet: Fleet) {
        this.incomingFleets.delete(fleet);
    }
    
    public addOrbitingFleet(fleet: Fleet) {
        this.orbitingFleets.add(fleet);
    }

    public removeOrbitingFleet(fleet: Fleet) {
        this.orbitingFleets.delete(fleet);
    }
}