import { Component } from '@angular/core';
import { Modal } from '../wrf-modal/services/wrf-modal-controller.service';
import { ModalControllerService } from '../modal/services/modal-controller.service';
import { Tab2Modal1Component } from './components/tab2-modal1/tab2-modal1.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    private modalControllerService: ModalControllerService
  ) {
  }

  async onPresent(): Promise<void> {
    const modal: Modal = await this.modalControllerService.create({
      component: Tab2Modal1Component,
      componentProps: { firstName: 'Alex2', lastName: 'Korenev2' },
      showBackdrop: true,
      swipeToClose: false,
      heightPart: 0.3,
      swipeToExpand: true,
      clickBackdropToClose: false,
      classes: 'aaaaaaaaaaaaaaaaaa',
    });
    modal.onWillPresent.then(event => console.log('onWillPresent', event));
    modal.onDidPresent.then(event => console.log('onDidPresent', event));
    modal.onWillDismiss.then(event => console.log('onWillDismiss', event));
    modal.onDidDismiss.then(event => console.log('onDidDismiss', event));
    this.modalControllerService.present(modal.id)
      .then(event => console.log('present', event));
  }

}
