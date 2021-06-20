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

import { ModalConfig, WrfModalControllerService } from '../../services/wrf-modal-controller.service';
import { WrfModalComponent } from '../wrf-modal/wrf-modal.component';

@Component({
  selector: 'app-wrf-modal-stack',
  templateUrl: './wrf-modal-stack.component.html',
  styleUrls: ['./wrf-modal-stack.component.scss']
})
export class WrfModalStackComponent implements OnInit, OnDestroy {

  configs: ModalConfig[] = [];
  private destroy$: Subject<void> = new Subject();

  @ViewChild(WrfModalComponent) private modalComponent: WrfModalComponent;
  @ViewChild('modalContent', { read: ViewContainerRef }) private modalContent: ViewContainerRef;

  constructor(
    private modalControllerService: WrfModalControllerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.modalControllerService.toPresent$
      .asObservable()
      .pipe(
        filter((config: ModalConfig) => !!config.component),
        takeUntil(this.destroy$)
      )
      .subscribe((config: ModalConfig) => {
        this.configs.push(config);
        this.changeDetectorRef.detectChanges();
        this.modalContent.clear();
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(config.component);
        const componentRef = this.modalContent.createComponent(componentFactory);
        if (config.componentProps) {
          const keys = Object.keys(config.componentProps);
          keys.forEach(key => componentRef.instance[key] = config.componentProps[key]);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
