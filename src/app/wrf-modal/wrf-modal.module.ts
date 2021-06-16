import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrfModalComponent } from './wrf-modal.component';
import { WrfModalControllerService } from './services/wrf-modal-controller.service';

@NgModule({
  declarations: [
    WrfModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WrfModalComponent
  ],
  providers: [
    WrfModalControllerService
  ]
})
export class WrfModalModule {
}
