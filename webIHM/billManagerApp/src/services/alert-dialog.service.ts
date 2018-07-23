//import { Injectable } from '@angular/core';

import {Injectable, Component, Input} from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{content}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() content;
  @Input() title;

  constructor(public activeModal: NgbActiveModal) {}

  onBtnClick(e) {
    this.activeModal.close(e)
  }
}

@Injectable({
  providedIn: 'root'
})
export class AlertDialogService {

  constructor(
    private modalService: NgbModal
  ) { }

  open(config) {
    const modalRef:NgbModalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.content = config.content;
    modalRef.componentInstance.title = config.title;
    return modalRef;
  }
}
