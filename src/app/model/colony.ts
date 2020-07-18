import { Planet } from './planet';
import { Civilization } from './civilization';
import { Entity } from '../services/render/renderer.interface';
import { Observable, Subject } from 'rxjs';
import { BuildingOrder } from './building-order';

export class Colony implements Entity {

    private changes: Subject<void> = new Subject();
    public entityType = 'colony';
    public buildingOrders: BuildingOrder[] = [];
    
    constructor(
        public id: string,
        public planet: Planet,
        public civilization: Civilization,
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
    
    public getChanges(): Observable<void> {
        return this.changes.asObservable();
    }
    
    public sendChanges(): void {
        this.changes.next();
    }
}