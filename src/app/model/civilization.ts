import { Planet } from './planet';
import { Fleet } from './fleet';

export class Civilization {

    
    public homeworld: Planet;
    public fleets: Set<Fleet> = new Set();

    public addFleet(fleet: Fleet) {
        this.fleets.add(fleet);
    }

    public removeFleet(fleet: Fleet) {
        this.fleets.delete(fleet);
    }

    constructor(
        public id: string,
        public name: string,
        public playerCivilization: boolean,
        public homeworldId: string
    ) {

    }

}