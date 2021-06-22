import { Component } from '@angular/core';

import { Modal, WrfModalControllerService } from '../wrf-modal/services/wrf-modal-controller.service';
import { Tab1ModalComponent } from './components/tab1-modal/tab1-modal.component';

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

  async onPresent(): Promise<void> {
    const modal: Modal = await this.modalControllerService.create({
      component: Tab1ModalComponent,
      componentProps: {firstName: 'Alex1', lastName: 'Korenev1'}
    });
    modal.onWillPresent.then(event => console.log('onWillPresent', event));
    modal.onDidPresent.then(event => console.log('onDidPresent', event));
    modal.onWillDismiss.then(event => console.log('onWillDismiss', event));
    modal.onDidDismiss.then(event => console.log('onDidDismiss', event));
    this.modalControllerService.present(modal.id)
      .then(event => console.log('present', event));
  }

}
