import { Component, Input, OnInit } from '@angular/core';
import { ModalContent, ModalControllerService } from '../../../modal/services/modal-controller.service';

@Component({
  selector: 'app-tab2-modal3',
  templateUrl: './tab2-modal3.component.html',
  styleUrls: ['./tab2-modal3.component.scss'],
})
export class Tab2Modal3Component implements OnInit, ModalContent {

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

  onDismissAll(): void {
    this.modalControllerService.dismissAll()
      .then(event => console.log('dismissAll', event));
  }

  onDismiss(): void {
    const fullName = `${this.firstName} ${this.lastName}`;
    this.modalControllerService.dismiss(this.modalId, fullName)
      .then(event => console.log('dismiss', event));
  }

}
