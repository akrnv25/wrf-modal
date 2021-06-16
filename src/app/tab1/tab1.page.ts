import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { WrfModalComponent } from '../wrf-modal/wrf-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private modalController: ModalController
  ) {
  }

  async openWffModal() {
    const modal = await this.modalController.create({
      component: WrfModalComponent,
      componentProps: { prop: 'prop' },
      mode: 'ios',
      swipeToClose: true,
      showBackdrop: true
    });
    modal.present();
  }

}
