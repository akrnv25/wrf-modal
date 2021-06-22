import { Component, Input, OnInit } from '@angular/core';

import { ModalComponent } from '../../../wrf-modal/components/wrf-modal-stack/wrf-modal-stack.component';
import { Modal, WrfModalControllerService } from '../../../wrf-modal/services/wrf-modal-controller.service';
import { Tab3ModalComponent } from '../tab3-modal/tab3-modal.component';

@Component({
  selector: 'app-tab2-modal',
  templateUrl: './tab2-modal.component.html',
  styleUrls: ['./tab2-modal.component.scss']
})
export class Tab2ModalComponent implements OnInit, ModalComponent {

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

  async onPresent(): Promise<void> {
    const modal: Modal = await this.modalControllerService.create({
      component: Tab3ModalComponent,
      componentProps: { firstName: 'Alex3', lastName: 'Korenev3' }
    });
    modal.onWillPresent.then(event => console.log('onWillPresent', event));
    modal.onDidPresent.then(event => console.log('onDidPresent', event));
    modal.onWillDismiss.then(event => console.log('onWillDismiss', event));
    modal.onDidDismiss.then(event => console.log('onDidDismiss', event));
    this.modalControllerService.present(modal.id)
      .then(event => console.log('present', event));
  }

  onDismiss(): void {
    const fullName = `${this.firstName} ${this.lastName}`;
    this.modalControllerService.dismiss(this.modalId, fullName)
      .then(event => console.log('dismiss', event));
  }

}
