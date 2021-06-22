import { Component, Input, OnInit } from '@angular/core';

import { ModalComponent } from '../../../wrf-modal/components/wrf-modal-stack/wrf-modal-stack.component';
import { WrfModalControllerService } from '../../../wrf-modal/services/wrf-modal-controller.service';

@Component({
  selector: 'app-tab3-modal',
  templateUrl: './tab3-modal.component.html',
  styleUrls: ['./tab3-modal.component.scss']
})
export class Tab3ModalComponent implements OnInit, ModalComponent {

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
