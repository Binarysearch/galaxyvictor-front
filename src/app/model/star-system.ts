import { Entity } from '../services/render/renderer.interface';

export class StarSystem implements Entity {

    constructor(
        public id: string,
        public name: string,
        public x: number,
        public y: number,
        public size: number,
        public type: number
    ) {

    }
}