import { Injectable, ViewContainerRef, ComponentFactoryResolver, Type } from '@angular/core';
import { Fleet } from '../model/fleet';
import { FleetExchangeWindowComponent } from '../modules/fleets/components/fleet-exchange-window/fleet-exchange-window.component';
import { PlanetsIndexComponent } from '../modules/planets/components/planets-index/planets-index.component';

export abstract class WindowManagerService {
  
  public abstract getOpenWindow();

  public abstract openFleetExchangeWindow(selected: Fleet, hovered: Fleet): void

  public abstract openPlanetListWindow(): void;

  public abstract openFleetsListWindow(): void;
  
  public abstract openColonyListWindow(): void;

  public abstract setWindowcontainer(windowContainer: ViewContainerRef);
  
  public abstract closeAll();

}
