import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { WindowManagerService } from '../../services/window-manager.service-abstract';

@Component({
  selector: 'app-central-window',
  templateUrl: './central-window.component.html',
  styleUrls: ['./central-window.component.css']
})
export class CentralWindowComponent implements OnInit {
  
  @ViewChild("openWindowContainer", { read: ViewContainerRef, static: true }) openWindowContainerRef: ViewContainerRef;

  constructor(
    private windowManagerService: WindowManagerService
  ) { }

  ngOnInit() {
    this.windowManagerService.setWindowcontainer(this.openWindowContainerRef);
  }

}
