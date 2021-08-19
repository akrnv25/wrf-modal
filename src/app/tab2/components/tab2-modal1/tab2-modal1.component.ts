import { Component, Input, OnInit } from '@angular/core';
import { Modal, ModalControllerService } from '../../../modal/services/modal-controller.service';
import { Tab2Modal2Component } from '../tab2-modal2/tab2-modal2.component';

@Component({
  selector: 'app-tab2-modal1',
  templateUrl: './tab2-modal1.component.html',
  styleUrls: ['./tab2-modal1.component.scss'],
})
export class Tab2Modal1Component implements OnInit {

  @Input() modalId: string;
  @Input() firstName: string;
  @Input() lastName: string;

  constructor(
    private modalControllerService: ModalControllerService
  ) {
  }

  ngOnInit(): void {
    console.log(this.firstName);
    console.log(this.lastName);
  }

  async onPresent(): Promise<void> {
    const modal: Modal = await this.modalControllerService.create({
      component: Tab2Modal2Component,
      componentProps: { firstName: 'Alex2', lastName: 'Korenev2' },
      showBackdrop: true,
      swipeToClose: true,
      heightPart: 0.2,
      swipeToExpand: true,
      clickBackdropToClose: true,
      classes: '',
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
