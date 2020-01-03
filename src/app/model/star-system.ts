import { Entity } from '../services/render/renderer.interface';
import { Fleet } from './fleet';
import { Planet } from './planet';
import { Subject, Observable } from 'rxjs';

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

    private changes: Subject<void> = new Subject();
    private _hasAlliedFleets: boolean = false;
    private _hasEnemyFleets: boolean = false;

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
        this.changes.next();
    }

    public removeIncomingFleet(fleet: Fleet) {
        this.incomingFleets.delete(fleet);
        this.changes.next();
    }
    
    public addOrbitingFleet(fleet: Fleet) {
        this.orbitingFleets.add(fleet);
        this.totalize();
        this.changes.next();
    }

    private totalize() {
        this._hasAlliedFleets = false;
        this._hasEnemyFleets = false;
        this.orbitingFleets.forEach(f => {
            if (f.civilization.playerCivilization) {
                this._hasAlliedFleets = true;
            } else {
                this._hasEnemyFleets = true;
            }
        });
    }

    public removeOrbitingFleet(fleet: Fleet) {
        this.orbitingFleets.delete(fleet);
        this.totalize();
        this.changes.next();
    }

    public getChanges(): Observable<void> {
        return this.changes.asObservable();
    }

    public get hasAlliedFleets(): boolean {
        return this._hasAlliedFleets;
    }

    public get hasEnemyFleets(): boolean {
        return this._hasEnemyFleets;
    }


}