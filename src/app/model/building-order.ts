import { Colony } from './colony';
import { BuildingOrderType } from '../dto/building-order-dto';

export class BuildingOrder {

    constructor(
        public id: string,
        public colony: Colony,
        public type: BuildingOrderType,
        public endTime: number,
        public startedTime: number
    ) { }
}