import { Component, Input, OnInit } from '@angular/core';

import { ModalComponent } from '../../../wrf-modal/components/wrf-modal-stack/wrf-modal-stack.component';
import { WrfModalControllerService } from '../../../wrf-modal/services/wrf-modal-controller.service';

@Component({
  selector: 'app-tab1-modal',
  templateUrl: './tab1-modal.component.html',
  styleUrls: ['./tab1-modal.component.scss']
})
export class Tab1ModalComponent implements OnInit, ModalComponent {

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

  onDismiss(): void {
    const fullName = `${this.firstName} ${this.lastName}`;
    this.modalControllerService.dismiss(this.modalId, fullName);
  }

}
