import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalService } from '../../../services/modal.service-abstract';

@Component({
  selector: 'app-modal-frame',
  templateUrl: './modal-frame.component.html',
  styleUrls: ['./modal-frame.component.css']
})
export class ModalFrameComponent implements OnInit {

  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  
  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {
  }

  onBackdropClicked() {
    this.modalService.back();
  }
}
