import { Component } from '@angular/core';

import { WrfModalControllerService } from '../wrf-modal/services/wrf-modal-controller.service';
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

  onPresent(): void {
    this.modalControllerService.present({
      component: Tab1ModalComponent,
      componentProps: {
        prop1: 'aaa',
        prop2: 25,
        prop3: [25, 25, 25],
        prop4: { name: 'Alex', lastName: 'Korenev' }
      },
      onDidPresent: () => {
        console.log('onDidPresent');
      },
      onWillDismiss: () => {
        console.log('onWillDismiss');
      },
      onDidDismiss: () => {
        console.log('onDidDismiss');
      }
    });
  }

}
