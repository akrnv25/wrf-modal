import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrfModalComponent } from './components/wrf-modal/wrf-modal.component';
import { WrfModalControllerService } from './services/wrf-modal-controller.service';
import { WrfModalStackComponent } from './components/wrf-modal-stack/wrf-modal-stack.component';

@NgModule({
  declarations: [
    WrfModalComponent,
    WrfModalStackComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WrfModalStackComponent
  ],
  providers: [
    WrfModalControllerService
  ]
})
export class WrfModalModule {
}
