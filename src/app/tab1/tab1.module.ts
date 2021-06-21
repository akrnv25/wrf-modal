import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { Tab1ModalComponent } from './components/tab1-modal/tab1-modal.component';
import { Tab2ModalComponent } from './components/tab2-modal/tab2-modal.component';
import { Tab3ModalComponent } from './components/tab3-modal/tab3-modal.component';

@NgModule({
  declarations: [
    Tab1Page,
    Tab1ModalComponent,
    Tab2ModalComponent,
    Tab3ModalComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ]
})
export class Tab1PageModule {
}
