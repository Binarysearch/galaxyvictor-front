import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef, Injector, ViewRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalFrameComponent } from '../modal-frame/modal-frame.component';
import { ModalService } from '../../../services/modal.service-abstract';

@Component({
  selector: 'app-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrls: ['./modal-container.component.css']
})
export class ModalContainerComponent implements OnInit, OnDestroy {

  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  
  private destroyed: Subject<void> = new Subject();
  components: ComponentRef<any>[];

  constructor(
    private modalService: ModalService,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.modalService.getWindows().pipe(takeUntil(this.destroyed)).subscribe(viewRef => {
      this.createWindow(viewRef);
    });
    this.modalService.getOnBack().pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.closeWindow();
    });
    this.modalService.getOnCloseAll().pipe(takeUntil(this.destroyed)).subscribe(() => {
      this.closeAll();
    });
  }
  
  private closeAll() {
    this.container.clear();
  }

  private closeWindow() {
    this.container.remove();
  }
  
  private createWindow(viewRef: ViewRef) {
    const factory = this.resolver.resolveComponentFactory(ModalFrameComponent);

    const componentRef = this.container.createComponent(factory);

    componentRef.instance.container.insert(viewRef);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
