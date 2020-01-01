import { Entity } from '../services/render/renderer.interface';
import { Fleet } from './fleet';

export class StarSystem implements Entity {

    public incomingFleets: Set<Fleet> = new Set();
    public orbitingFleets: Set<Fleet> = new Set();

    constructor(
        public id: string,
        public name: string,
        public x: number,
        public y: number,
        public size: number,
        public type: number
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