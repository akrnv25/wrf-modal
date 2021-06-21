import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ModalConfig, WrfModalControllerService } from '../../services/wrf-modal-controller.service';
import { ModalEvent } from '../wrf-modal/wrf-modal.component';

export interface ModalComponent {
  modalId: string;
}

@Component({
  selector: 'app-wrf-modal-stack',
  templateUrl: './wrf-modal-stack.component.html',
  styleUrls: ['./wrf-modal-stack.component.scss']
})
export class WrfModalStackComponent implements OnInit, OnDestroy {

  configs: ModalConfig[] = [];
  private destroy$: Subject<void> = new Subject();

  @ViewChildren('modalContent', { read: ViewContainerRef }) private modalContents: QueryList<ViewContainerRef>;

  constructor(
    private modalControllerService: WrfModalControllerService,
    private changeDetectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit(): void {
    this.modalControllerService.toPresent$
      .pipe(
        filter((config: ModalConfig) => !!config.component),
        takeUntil(this.destroy$)
      )
      .subscribe((config: ModalConfig) => {
        this.configs.push(config);
        this.changeDetectorRef.detectChanges();
        const modalContent = this.modalContents.last;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(config.component);
        const componentRef: ComponentRef<ModalComponent> = modalContent.createComponent(componentFactory);
        componentRef.instance.modalId = config.id;
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

  onWillPresent(event: ModalEvent): void {
    const config = this.getConfig(event.id);
    config.onWillPresent(event);
  }

  onDidPresent(event: ModalEvent): void {
    const config = this.getConfig(event.id);
    config.onDidPresent(event);
  }

  onWillDismiss(event: ModalEvent): void {
    const config = this.getConfig(event.id);
    config.onWillDismiss(event);
  }

  onDidDismiss(event: ModalEvent): void {
    const config = this.getConfig(event.id);
    config.onDidDismiss(event);
    this.configs = this.configs.filter(c => c.id !== event.id);
    this.changeDetectorRef.detectChanges();
  }

  configsByID(index: number, config: ModalConfig): string {
    return config.id;
  }

  private getConfig(id: string): ModalConfig {
    return this.configs.find(config => config.id === id);
  }

}
