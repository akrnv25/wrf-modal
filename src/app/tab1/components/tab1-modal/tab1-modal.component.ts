import { Component, Input, OnInit } from '@angular/core';

import { ModalComponent } from '../../../wrf-modal/components/wrf-modal-stack/wrf-modal-stack.component';
import { WrfModalControllerService } from '../../../wrf-modal/services/wrf-modal-controller.service';
import { ModalEvent } from '../../../wrf-modal/components/wrf-modal/wrf-modal.component';
import { Tab2ModalComponent } from '../tab2-modal/tab2-modal.component';

@Component({
  selector: 'app-tab1-modal',
  templateUrl: './tab1-modal.component.html',
  styleUrls: ['./tab1-modal.component.scss']
})
export class Tab1ModalComponent implements OnInit, ModalComponent {

  @Input() modalId: string;
  @Input() firstName: string;
  @Input() lastName: string;

  constructor(
    private modalControllerService: WrfModalControllerService
  ) {
  }

  ngOnInit(): void {
    console.log(this.firstName);
    console.log(this.lastName);
  }

  onPresent(): void {
    this.modalControllerService.present({
      component: Tab2ModalComponent,
      componentProps: {
        firstName: 'Alex',
        lastName: 'Korenev'
      },
      onWillPresent: (event: ModalEvent) => {
        console.log('onWillPresent', event);
      },
      onDidPresent: (event: ModalEvent) => {
        console.log('onDidPresent', event);
      },
      onWillDismiss: (event: ModalEvent) => {
        console.log('onWillDismiss', event);
      },
      onDidDismiss: (event: ModalEvent) => {
        console.log('onDidDismiss', event);
      }
    });
  }

  onDismiss(): void {
    const fullName = `${this.firstName} ${this.lastName}`;
    this.modalControllerService.dismiss(this.modalId, fullName);
  }

}
