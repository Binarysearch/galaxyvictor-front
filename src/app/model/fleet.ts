import { Entity } from '../services/render/renderer.interface';
import { TimeService } from '../services/time.service';
import { StarSystem } from './star-system';
import { FLEET_ROTATION_SPEED_MULT } from '../galaxy-constants';
import { Civilization } from './civilization';

export class Fleet implements Entity {

    private orbit = 4;

    constructor(
        public id: string,
        public seed: number,
        public speed: number,
        public startTravelTime: number,
        public origin: StarSystem,
        public destination: StarSystem,
        public civilization: Civilization,
        private timeService: TimeService
    ) {
        
    }

    get x(): number {
        let travelX = this.destination.x;
        if (this.isTravelling) {
            const p = this.travelPercent;
            travelX = this.destination.x * p + this.origin.x * (1 - p);
        }

        return Math.cos(this.angle) * this.orbit * 0.01 + travelX;
    }

    get y(): number {
        let travelY = this.destination.y;
        if (this.isTravelling) {
            const p = this.travelPercent;
            travelY = this.destination.y * p + this.origin.y * (1 - p);
        }

        return Math.sin(this.angle) * this.orbit * 0.01 + travelY;
    }

    get travelDistance() {
        const x = this.origin.x - this.destination.x;
        const y = this.origin.y - this.destination.y;
        return Math.sqrt(x * x + y * y);
    }

    get angle(): number {
        if (this.isTravelling) {
            return Math.atan2(this.destination.y - this.origin.y, this.destination.x - this.origin.x) - Math.PI / 2;
        }
        const startingAngle = (this.seed) % (Math.PI * 2);
        const time = new Date().getTime() * 0.001;
        const speed = FLEET_ROTATION_SPEED_MULT / Math.sqrt(this.orbit);
        return ((startingAngle + speed * time) % (Math.PI * 2));
    }

    get travelPercent() {
        if (this.destination.id !== this.origin.id) {

            const travelTime = this.travelDistance / this.speed;
            const timeElapsed = this.timeService.getGameTime() - this.startTravelTime;
            const remainingTime = travelTime - timeElapsed;
            return 1 - Math.max(Math.min(remainingTime / travelTime, 1), 0);
        }
        return 1;
    }

    get isTravelling(): boolean {
        return this.destination.id !== this.origin.id && this.travelPercent < 1;
    }

    get name(): string {
        return `Flota de ${this.civilization.name}`;
    }
}