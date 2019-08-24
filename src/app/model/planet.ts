import { Entity } from '../services/render/renderer.interface';
import { StarSystem } from './star-system';
import { PLANET_ROTATION_SPEED_MULT, PLANET_ORBIT_SCALE_MULTIPLIER } from '../galaxy-constants';

export class Planet implements Entity {

    constructor(
        public id: string,
        public type: number,
        public size: number,
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
        const startingAngle = (this.type * this.size * this.orbit) % (Math.PI * 2);
        const time = new Date().getTime() * 0.001;
        const speed = PLANET_ROTATION_SPEED_MULT / Math.sqrt(this.orbit);
        return (startingAngle + speed * time) % (Math.PI * 2);
    }
}