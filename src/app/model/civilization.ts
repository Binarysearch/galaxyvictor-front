import { Planet } from './planet';

export class Civilization {
    
    public homeworld: Planet

    constructor(
        public id: string,
        public name: string
    ) {

    }

}