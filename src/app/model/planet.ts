import { Entity } from '../services/render/renderer.interface';
import { StarSystem } from './star-system';
import { PLANET_ROTATION_SPEED_MULT, PLANET_ORBIT_SCALE_MULTIPLIER } from '../galaxy-constants';
import { Colony } from './colony';

export interface PlanetSize {
    id: number;
    name: string;
    description: string;
}

export interface PlanetType {
    id: number;
    name: string;
    description: string;
    color: { r: number; g: number; b: number };
    colorHex: string;
}

export class Planet implements Entity {
    
    colony: Colony;
    public entityType = 'planet';

    constructor(
        public id: string,
        public type: PlanetType,
        public size: PlanetSize,
        public orbit: number,
        public starSystem: StarSystem
    ) {

    }

    get x(): number {
        return Math.cos(this.angle) * this.orbit * PLANET_ORBIT_SCALE_MULTIPLIER + this.starSystem.x;
    }

    get y(): number {
        return Math.sin(this.angle) * this.orbit * PLANET_ORBIT_SCALE_MULTIPLIER + this.starSystem.y;
    }

    get angle(): number {
        const startingAngle = (this.type.id * this.size.id * this.orbit) % (Math.PI * 2);
        const time = new Date().getTime() * 0.001;
        const speed = PLANET_ROTATION_SPEED_MULT / Math.sqrt(this.orbit);
        return (startingAngle + speed * time) % (Math.PI * 2);
    }

    get name(): string {
        return this.starSystem.name + ' ' + this.orbit;
    }
}