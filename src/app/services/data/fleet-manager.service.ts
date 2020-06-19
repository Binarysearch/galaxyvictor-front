import { Injectable } from '@angular/core';
import { FleetInfoDto } from '../../dto/fleet-info';
import { Store } from './store';
import { TimeService } from '../time.service';
import { Fleet } from '../../model/fleet';
import { StarsService } from './stars.service';

@Injectable({
  providedIn: 'root'
})
export class FleetManagerService {

  constructor(
    private store: Store,
    private timeService: TimeService,
    private starsService: StarsService
  ) { }

  public updateFleets(fleetDtos: FleetInfoDto[]): void {
    fleetDtos.forEach(fleetDto => this.updateFleet(fleetDto));
  }

  public updateFleet(fleetDto: FleetInfoDto): void {
    const existing = this.store.getFleetById(fleetDto.id);
    if (!existing) {
      this.addFleet(fleetDto);
    } else {
      this.updateExistingFleet(existing, fleetDto);
    }
  }

  private updateExistingFleet(existing: Fleet, fleetDto: FleetInfoDto) {
    existing.origin.removeIncomingFleet(existing);
    existing.origin.removeOrbitingFleet(existing);
    existing.destination.removeIncomingFleet(existing);
    existing.destination.removeOrbitingFleet(existing);
    existing.civilization.removeFleet(existing);

    existing.origin = this.starsService.getStarById(fleetDto.originId);
    existing.destination = this.starsService.getStarById(fleetDto.destinationId);
    existing.civilization = this.store.getCivilizationById(fleetDto.civilizationId);
    existing.startTravelTime = fleetDto.startTravelTime;
    existing.speed = fleetDto.speed;
    existing.seed = fleetDto.seed;

    if (fleetDto.destinationId === fleetDto.originId) {
      existing.origin.addOrbitingFleet(existing);
    } else {
      existing.destination.addIncomingFleet(existing);
    }
    existing.civilization.addFleet(existing);
    existing.sendChanges();
  }

  private addFleet(fleetDto: FleetInfoDto) {
    const fleet = new Fleet(
      fleetDto.id,
      fleetDto.seed,
      fleetDto.speed,
      fleetDto.startTravelTime,
      this.starsService.getStarById(fleetDto.originId),
      this.starsService.getStarById(fleetDto.destinationId),
      this.store.getCivilizationById(fleetDto.civilizationId),
      this.timeService
    );
    this.store.addFleets([fleet]);

    if (fleetDto.destinationId === fleetDto.originId) {
      fleet.origin.addOrbitingFleet(fleet);
    } else {
      fleet.destination.addIncomingFleet(fleet);
    }
    fleet.civilization.addFleet(fleet);
  }

  public removeFleetById(fleetId: string) {
    const fleet = this.store.getFleetById(fleetId);
    this.removeFleet(fleet);
  }

  public removeFleet(fleet: Fleet) {
    this.store.removeFleet(fleet);
    fleet.destination.incomingFleets.delete(fleet);
    fleet.destination.orbitingFleets.delete(fleet);
    fleet.origin.incomingFleets.delete(fleet);
    fleet.origin.orbitingFleets.delete(fleet);
    fleet.civilization.fleets.delete(fleet);
  }

}
