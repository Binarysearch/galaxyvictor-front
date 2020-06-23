import { Injectable } from '@angular/core';
import { Entity } from './render/renderer.interface';
import { Fleet } from '../model/fleet';
import { StarSystem } from '../model/star-system';
import { CommandService } from './command.service';
import { WindowManagerService } from './window-manager.service-abstract';

export interface MapAction {

  description: string;
  execute(): void;

}

@Injectable({
  providedIn: 'root'
})
export class MapActionResolverService {

  constructor(
    private command: CommandService,
    private windowManager: WindowManagerService
  ) { }

  public getPosibleAction(selected: Entity, hovered: Entity): MapAction {
    if (!(selected && hovered) || selected.id === hovered.id) {
      return null;
    }

    // Acciones de flotas aliadas no viajando
    if (selected instanceof Fleet && selected.civilization.playerCivilization && !selected.isTravelling) {
      return this.getPosibleFleetAction(selected, hovered);
    }

    return null;
  }

  private getPosibleFleetAction(selected: Fleet, hovered: Entity): MapAction {

    // Si se hace click derecho sobre una estrella se inicia un viaje si no se esta ya en la estrella
    if (hovered instanceof StarSystem && selected.destination.id !== hovered.id) {

      // Si hay alguna nave sin seleccionar se dividira la flota, sino se iniciara un viaje normal
      if (selected.unSelectedShips && selected.unSelectedShips.size > 0) {
        return {
          description: `Dividir la flota y enviar naves a ${hovered.name}`,
          execute: () => {
            this.command.startTravel(selected.id, selected.destination.id, hovered.id);
          }
        }
      } else {
        return {
          description: `Viajar al sistema ${hovered.name}`,
          execute: () => {
            this.command.startTravel(selected.id, selected.destination.id, hovered.id);
          }
        }
      }
    }

    // Si se hace click derecho sobre otra flota aliada se abre la ventana de intercambio entre flotas
    if (hovered instanceof Fleet && hovered.civilization.playerCivilization && selected.destination.id === hovered.destination.id) {
      return {
        description: `Intercambiar`,
        execute: () => this.windowManager.openFleetExchangeWindow(selected, hovered)
      }
    }

  }

}
