import { Component } from '@angular/core';

import { Modal, WrfModalControllerService } from '../wrf-modal/services/wrf-modal-controller.service';
import { Tab1ModalComponent } from './components/tab1-modal/tab1-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  private modal: Modal;

  constructor(
    private modalControllerService: WrfModalControllerService
  ) {
  }

  async onPresentClick(): Promise<void> {
    this.modal = await this.modalControllerService.create({
      component: Tab1ModalComponent,
      componentProps: {
        prop1: 'aaa',
        prop2: 25,
        prop3: [25, 25, 25],
        prop4: { name: 'Alex', lastName: 'Korenev' }
      }
    });
    this.modal.present();
    this.modal.onDismiss().then(res => {
      console.log(res);
    });
  }

}
