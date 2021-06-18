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

  async openWrfModal(): Promise<void> {
    const modal: Modal = await this.modalControllerService.create({
      component: Tab1ModalComponent
    });
    modal.present();
  }

}
