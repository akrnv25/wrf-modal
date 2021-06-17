import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrfModalComponent } from './components/wrf-modal/wrf-modal.component';
import { WrfModalControllerService } from './services/wrf-modal-controller.service';
import { WrfModalsStackComponent } from './components/wrf-modals-stack/wrf-modals-stack.component';

@NgModule({
  declarations: [
    WrfModalComponent,
    WrfModalsStackComponent
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
