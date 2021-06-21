import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { fromEvent, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { ModalConfig, WrfModalControllerService } from '../../services/wrf-modal-controller.service';

enum SwipeDirection {
  UP,
  DOWN
}

interface ModalBreakpoints {
  fullSize: number;
  partialSize: number;
  needClose: number;
  closed: number;
}

export interface ModalEvent {
  id: string;
  data?: any;
}

@Component({
  selector: 'app-wrf-modal',
  templateUrl: './wrf-modal.component.html',
  styleUrls: ['./wrf-modal.component.scss']
})
export class WrfModalComponent implements AfterViewInit, OnDestroy {

  @Input() config: ModalConfig;
  @Output() willPresent: EventEmitter<ModalEvent> = new EventEmitter();
  @Output() didPresent: EventEmitter<ModalEvent> = new EventEmitter();
  @Output() willDismiss: EventEmitter<ModalEvent> = new EventEmitter();
  @Output() didDismiss: EventEmitter<ModalEvent> = new EventEmitter();

  private breakpoints: ModalBreakpoints;
  private modal: HTMLElement;
  private backdrop: HTMLElement;
  private container: HTMLElement;
  private destroy$: Subject<void> = new Subject();

  constructor(
    private gestureController: GestureController,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private modalControllerService: WrfModalControllerService
  ) {
  }

  ngAfterViewInit(): void {
    this.findElements();
    this.handleDismiss();
    this.handleContainerSwipe();
    this.handleBackdropClick();
    this.showElements();
    this.calcBreakpoints()
      .then(() => this.present());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private findElements(): void {
    this.modal = this.elementRef.nativeElement.querySelector('.wrf-modal');
    this.backdrop = this.modal.querySelector('.wrf-modal__backdrop');
    this.container = this.modal.querySelector('.wrf-modal__container');
  }

  private handleDismiss(): void {
    this.modalControllerService.toDismiss$
      .pipe(
        filter((event: ModalEvent) => event.id === this.config.id),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe((event: ModalEvent) => {
        this.dismiss(event.data)
          .then(() => this.hideElements());
      });
  }

  private handleContainerSwipe(): void {
    let startTop: number;
    let direction: SwipeDirection;
    let prevTop: number;
    const gesture: Gesture = this.gestureController.create({
      el: this.container,
      gestureName: 'swipe',
      threshold: 10,
      direction: 'y',
      onStart: () => {
        startTop = this.container.getBoundingClientRect().y;
        prevTop = startTop;
      },
      onMove: (event: GestureDetail) => {
        const { deltaY } = event;
        const top = startTop + deltaY;
        let checkedTop;
        if (top < this.breakpoints.fullSize) {
          checkedTop = this.breakpoints.fullSize;
        } else if (top > this.breakpoints.closed) {
          checkedTop = this.breakpoints.closed;
        } else {
          checkedTop = top;
        }
        this.renderer2.setStyle(this.container, 'transition', 'none');
        this.renderer2.setStyle(this.container, 'top', `${checkedTop}px`);
        direction = checkedTop < prevTop ? SwipeDirection.UP : SwipeDirection.DOWN;
        prevTop = checkedTop;
      },
      onEnd: () => {
        switch (direction) {
          case SwipeDirection.UP:
            this.pushContainer(this.breakpoints.fullSize);
            break;
          case SwipeDirection.DOWN:
            const { y } = this.container.getBoundingClientRect();
            const isClosing = this.breakpoints.needClose < y;
            if (isClosing) {
              this.pushContainer(this.breakpoints.closed).then(() => {
                this.modalControllerService.dismiss(this.config.id);
              });
            } else {
              this.pushContainer(this.breakpoints.partialSize);
            }
            break;
        }
      }
    });
    gesture.enable(true);
  }

  private handleBackdropClick(): void {
    fromEvent(this.backdrop, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalControllerService.dismiss(this.config.id);
      });
  }

  private calcBreakpoints(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        const height = this.modal.clientHeight;
        this.breakpoints = {
          fullSize: 0,
          partialSize: Math.round(height * 0.5),
          needClose: Math.round(height * 0.75),
          closed: height
        };
        resolve();
      }, 0);
    });
  }

  private pushContainer(top: number): Promise<void> {
    const animationDuration = 300;
    return new Promise((resolve, reject) => {
      this.renderer2.setStyle(this.container, 'transition', `${animationDuration}ms ease-in`);
      setTimeout(() => {
        this.renderer2.setStyle(this.container, 'top', `${top}px`);
      }, 0);
      setTimeout(() => {
        resolve();
      }, animationDuration);
    });
  }

  private showElements(): void {
    this.renderer2.setStyle(this.modal, 'z-index', '1000');
    this.renderer2.setStyle(this.backdrop, 'z-index', '1000');
    this.renderer2.setStyle(this.container, 'z-index', '1000');
  }

  private hideElements(): void {
    this.renderer2.setStyle(this.modal, 'z-index', '-1000');
    this.renderer2.setStyle(this.backdrop, 'z-index', '-1000');
    this.renderer2.setStyle(this.container, 'z-index', '-1000');
  }

  private present(): Promise<void> {
    this.willPresent.emit({ id: this.config.id });
    return this.pushContainer(this.breakpoints.partialSize)
      .then(() => this.didPresent.emit({ id: this.config.id }));
  }

  private dismiss(data: any): Promise<void> {
    this.willDismiss.emit({ id: this.config.id, data });
    return this.pushContainer(this.breakpoints.closed)
      .then(() => {
        this.didDismiss.emit({ id: this.config.id, data });
      });
  }

}
