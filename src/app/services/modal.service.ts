import { Injectable, Type, ComponentFactoryResolver, ComponentRef, Injector, ViewRef } from '@angular/core';
import { ModalService, Modal } from './modal.service-abstract';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceImpl extends ModalService {

  private windows: Subject<ViewRef> = new Subject();
  private back$: Subject<void> = new Subject();
  private closeAll$: Subject<void> = new Subject();


  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    super();
  }

  public getWindows(): Observable<ViewRef> {
    return this.windows.asObservable();
  }

  public getOnBack(): Observable<void> {
    return this.back$.asObservable();
  }

  public getOnCloseAll(): Observable<void> {
    return this.closeAll$.asObservable();
  }

  public openWindow<T>(component: Type<T>, data?: any): void {
    this.windows.next(this.createComponent({ component: component, data: data }).hostView);
  }

  public closeAll(): void {
    this.closeAll$.next();
  }

  public back(): void {
    this.back$.next();
  }

  private createComponent(window: { component: Type<any>, data?: any}): ComponentRef<any> {
    const factory = this.resolver.resolveComponentFactory(window.component);

    const inputs: Set<string> = new Set(factory.inputs.map(input => input.propName));

    const injector = Injector.create([{ provide: Modal, useValue: { close: () => {console.log('close');}} }], this.injector);

    const componentRef = factory.create(injector);
   
    if (window.data) {
      Object.keys(window.data).filter(key => inputs.has(key)).forEach(key => componentRef.instance[key] = window.data[key]);
    }

    return componentRef;
  }
}