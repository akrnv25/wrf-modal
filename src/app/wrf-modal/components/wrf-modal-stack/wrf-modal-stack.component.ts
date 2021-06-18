import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Modal, ModalToCreate, WrfModalControllerService } from '../../services/wrf-modal-controller.service';
import { WrfModalComponent } from '../wrf-modal/wrf-modal.component';

@Component({
  selector: 'app-wrf-modal-stack',
  templateUrl: './wrf-modal-stack.component.html',
  styleUrls: ['./wrf-modal-stack.component.scss']
})
export class WrfModalStackComponent implements OnInit, OnDestroy {

  modals: ModalToCreate[] = [];
  private destroy$: Subject<void> = new Subject();

  @ViewChild(WrfModalComponent) private modalComponent: WrfModalComponent;
  @ViewChild('modalContainer', { read: ViewContainerRef }) private modalContainerRef: ViewContainerRef;

  constructor(
    private modalControllerService: WrfModalControllerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.modalControllerService.modalToCreate
      .asObservable()
      .pipe(
        filter(({ config }: ModalToCreate) => !!config.component),
        takeUntil(this.destroy$)
      )
      .subscribe((modalToCreate: ModalToCreate) => {
        this.modals.push(modalToCreate);
        this.changeDetectorRef.detectChanges();
        const { config, id } = modalToCreate;
        this.modalContainerRef.clear();
        if (config.component) {
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(config.component);
          const componentRef = this.modalContainerRef.createComponent(componentFactory);
          const modal: Modal = {
            present: this.modalComponent.present.bind(this.modalComponent),
            onDidDismiss: null
          };
          this.modalControllerService.createdModal.next({ modal, id });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
