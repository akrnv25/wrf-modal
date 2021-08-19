import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalControllerService } from './services/modal-controller.service';
import { ModalComponent } from './components/modal/modal.component';
import { ModalStackComponent } from './components/modal-stack/modal-stack.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ModalComponent,
    ModalStackComponent,
  ],
  exports: [
    ModalStackComponent,
  ],
  providers: [
    ModalControllerService,
  ],
})
export class ModalModule {
}
