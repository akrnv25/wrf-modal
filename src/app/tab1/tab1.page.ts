import { Component } from '@angular/core';

import { WrfModalControllerService } from '../wrf-modal/services/wrf-modal-controller.service';
import { Tab1ModalComponent } from './components/tab1-modal/tab1-modal.component';
import { ModalEvent } from '../wrf-modal/components/wrf-modal/wrf-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private modalControllerService: WrfModalControllerService
  ) {
  }

  onPresent(): void {
    this.modalControllerService.present({
      component: Tab1ModalComponent,
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

}
