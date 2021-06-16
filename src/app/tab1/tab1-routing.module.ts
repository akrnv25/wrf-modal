import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Tab1Page } from './tab1.page';
import { Tab1ModalComponent } from './components/tab1-modal/tab1-modal.component';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page
  }
];

@NgModule({
  declarations: [Tab1ModalComponent],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {
}
