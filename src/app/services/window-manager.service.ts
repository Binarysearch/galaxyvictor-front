import { Injectable, ViewContainerRef, ComponentFactoryResolver, Type, ComponentRef } from '@angular/core';
import { Fleet } from '../model/fleet';
import { FleetExchangeWindowComponent } from '../modules/fleets/components/fleet-exchange-window/fleet-exchange-window.component';
import { PlanetsIndexComponent } from '../modules/planets/components/planets-index/planets-index.component';
import { FleetsIndexComponent } from '../modules/fleets/components/fleets-index/fleets-index.component';
import { ColoniesIndexComponent } from '../modules/colonies/components/colonies-index/colonies-index.component';
import { WindowManagerService } from './window-manager.service-abstract';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerServiceImpl extends WindowManagerService {

  private windowContainer: ViewContainerRef;
  private openWindow: ComponentRef<any>;
  
  constructor(
    private resolver: ComponentFactoryResolver
  ) {
    super();
  }

  public openFleetExchangeWindow(selected: Fleet, hovered: Fleet): void {
    this.open(FleetExchangeWindowComponent).setFleets(selected, hovered);
  }

  public openPlanetListWindow(): void {
    this.open(PlanetsIndexComponent);
  }

  public openFleetsListWindow(): void {
    this.open(FleetsIndexComponent);
  }

  public openColonyListWindow(): void {
    this.open(ColoniesIndexComponent);
  }

  public setWindowcontainer(windowContainer: ViewContainerRef) {
    this.windowContainer = windowContainer;
  }

  public closeAll() {
    this.openWindow = null;
    this.windowContainer.clear();
  }

  private open<T>(component: Type<T>): T {
    this.closeAll();
    const componentFactory = this.resolver.resolveComponentFactory(component);
    const componentRef = this.windowContainer.createComponent(componentFactory);
    this.openWindow = componentRef;
    return (<T>componentRef.instance);
  }

  public getOpenWindow(): ComponentRef<any> {
    return this.openWindow;
  }
}
