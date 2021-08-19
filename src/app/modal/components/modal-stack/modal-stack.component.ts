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
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { ModalComponent } from '../modal/modal.component';
import { Modal, ModalConfig, ModalEvent } from '../../services/modal-controller.service';
import { ModalStreamService } from '../../services/modal-stream.service';

@Component({
  selector: 'app-modal-stack',
  templateUrl: './modal-stack.component.html',
  styleUrls: ['./modal-stack.component.scss'],
})
export class ModalStackComponent implements OnInit, OnDestroy {

  configs: ModalConfig[] = [];
  private destroy$: Subject<void> = new Subject();

  @ViewChildren(ModalComponent, { read: ModalComponent }) private modalComponents: QueryList<ModalComponent>;
  @ViewChildren('modalContent', { read: ViewContainerRef }) private modalContents: QueryList<ViewContainerRef>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private modalStreamService: ModalStreamService,
  ) {
  }

  ngOnInit(): void {
    this.modalStreamService.toCreate$
      .asObservable()
      .pipe(
        filter((config: ModalConfig) => !!config.component),
        takeUntil(this.destroy$)
      )
      .subscribe((config: ModalConfig) => {
        this.configs.push(config);
        this.changeDetectorRef.detectChanges();
        const modalContent = this.modalContents.last;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(config.component);
        const componentRef: ComponentRef<{ modalId: string }> = modalContent.createComponent(componentFactory);
        componentRef.instance.modalId = config.id;
        if (config.componentProps) {
          const keys = Object.keys(config.componentProps);
          keys.forEach(key => componentRef.instance[key] = config.componentProps[key]);
        }
        const modal: Modal = {
          id: config.id,
          onWillPresent: this.onWillPresent(config.id),
          onDidPresent: this.onDidPresent(config.id),
          onWillDismiss: this.onWillDismiss(config.id),
          onDidDismiss: this.onDidDismiss(config.id)
        };
        this.modalStreamService.created$.next(modal);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  configsByID(index: number, config: ModalConfig): string {
    return config.id;
  }

  private onWillPresent(id: string): Promise<ModalEvent> {
    return this.modalComponents.last.willPresent
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === id),
        take(1)
      )
      .toPromise();
  }

  private onDidPresent(id: string): Promise<ModalEvent> {
    return this.modalComponents.last.didPresent
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === id),
        take(1)
      )
      .toPromise();
  }

  private onWillDismiss(id: string): Promise<ModalEvent> {
    return this.modalComponents.last.willDismiss
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === id),
        take(1)
      )
      .toPromise();
  }

  private onDidDismiss(id: string): Promise<ModalEvent> {
    return this.modalComponents.last.didDismiss
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === id),
        take(1),
        tap((event: ModalEvent) => {
          this.configs = this.configs.filter(config => config.id !== event.id);
          this.changeDetectorRef.detectChanges();
        })
      )
      .toPromise();
  }

}
