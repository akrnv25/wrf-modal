import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ModalConfig, ModalEvent } from '../../services/modal-controller.service';
import { ModalStreamService } from '../../services/modal-stream.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['modal.component.scss'],
})
export class ModalComponent implements AfterViewInit, OnDestroy {

  @Input() public config: ModalConfig;
  @Output() public willPresent: EventEmitter<ModalEvent> = new EventEmitter();
  @Output() public didPresent: EventEmitter<ModalEvent> = new EventEmitter();
  @Output() public willDismiss: EventEmitter<ModalEvent> = new EventEmitter();
  @Output() public didDismiss: EventEmitter<ModalEvent> = new EventEmitter();

  private modal: HTMLElement;
  private backdrop: HTMLElement;
  private container: HTMLElement;
  private swipeLine: HTMLElement;
  private destroy$: Subject<void> = new Subject();
  private breakpoints: {
    full: number;
    basic: number;
    closed: number;
  };

  constructor(
    private gestureController: GestureController,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private modalStreamService: ModalStreamService,
  ) {
  }

  public ngAfterViewInit(): void {
    this.findElements();
    this.setBreakpoints();
    this.handleContainerSwipe();
    this.handleBackdropDismiss();
    this.handlePresent();
    this.handleDismiss();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private findElements(): void {
    this.modal = this.elementRef.nativeElement.querySelector('.modal');
    this.backdrop = this.modal.querySelector('.modal__backdrop');
    this.container = this.modal.querySelector('.modal__container');
    this.swipeLine = this.modal.querySelector('.modal__swipe-line');
  }

  private setBreakpoints(): void {
    const screenSize = this.getScreenSize();
    const swipeLineHeight = 20;
    this.breakpoints = {
      full: this.config.fullscreen ? screenSize.height : screenSize.height - swipeLineHeight,
      basic: Math.round(screenSize.height * this.config.heightPart),
      closed: 0,
    };
  }

  private handleContainerSwipe(): void {
    if (!this.config.swipeToClose && !this.config.swipeToExpand) {
      return;
    }

    let startHeight: number;
    let prevMoveHeight: number;
    let direction: 'up' | 'down';
    const gesture: Gesture = this.gestureController.create({
      el: this.swipeLine,
      gestureName: 'swipe',
      threshold: 10,
      direction: 'y',
      onStart: () => {
        startHeight = this.container.clientHeight;
      },
      onMove: (event: GestureDetail) => {
        let moveHeight = startHeight - event.deltaY;
        if (!this.config.swipeToExpand && moveHeight > this.breakpoints.basic) {
          moveHeight = this.breakpoints.basic;
        }
        if (!this.config.swipeToClose && moveHeight < this.breakpoints.basic) {
          moveHeight = this.breakpoints.basic;
        }
        if (moveHeight > this.breakpoints.full) {
          moveHeight = this.breakpoints.full;
        }
        if (moveHeight < this.breakpoints.closed) {
          moveHeight = this.breakpoints.closed;
        }
        direction = prevMoveHeight <= moveHeight && moveHeight !== 0 ? 'up' : 'down';
        prevMoveHeight = moveHeight;
        this.renderer2.setStyle(this.container, 'transition', 'none');
        this.renderer2.setStyle(this.container, 'height', `${moveHeight}px`);
      },
      onEnd: () => {
        if (this.config.swipeToExpand && prevMoveHeight > this.breakpoints.basic) {
          switch (direction) {
            case 'up':
              this.resizeContainer(this.breakpoints.full);
              break;
            case 'down':
              this.resizeContainer(this.breakpoints.basic);
              break;
          }
        }
        if (this.config.swipeToClose && prevMoveHeight < this.breakpoints.basic) {
          switch (direction) {
            case 'up':
              this.resizeContainer(this.breakpoints.basic);
              break;
            case 'down':
              this.dismiss({ id: this.config.id });
              break;
          }
        }
      },
    });
    gesture.enable(true);
  }

  private handleBackdropDismiss(): void {
    if (this.config.showBackdrop && this.config.clickBackdropToClose) {
      fromEvent(this.backdrop, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.dismiss({ id: this.config.id });
        });
    }
  }

  private handlePresent(): void {
    this.modalStreamService.toPresent$
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === this.config.id),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.present();
      });
  }

  private handleDismiss(): void {
    this.modalStreamService.toDismiss$
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === this.config.id),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe((event: ModalEvent) => {
        this.dismiss(event);
      });
  }

  private resizeContainer(height: number): Promise<void> {
    const animationDuration = 300;
    return new Promise(resolve => {
      this.renderer2.setStyle(this.container, 'transition', `${animationDuration}ms ease-in`);
      setTimeout(() => {
        this.renderer2.setStyle(this.container, 'height', `${height}px`);
      }, 0);
      setTimeout(() => {
        resolve();
      }, animationDuration);
    });
  }

  private showElements(): void {
    this.renderer2.setStyle(this.modal, 'display', 'block');
    if (this.config.showBackdrop) {
      this.renderer2.setStyle(this.backdrop, 'display', 'block');
    }
    this.renderer2.setStyle(this.container, 'display', 'block');
  }

  private hideElements(): void {
    this.renderer2.setStyle(this.modal, 'display', 'none');
    if (this.config.showBackdrop) {
      this.renderer2.setStyle(this.backdrop, 'display', 'none');
    }
    this.renderer2.setStyle(this.container, 'display', 'none');
  }

  private present(): void {
    const event: ModalEvent = { id: this.config.id };
    this.willPresent.emit(event);
    this.showElements();
    this.resizeContainer(this.breakpoints.basic)
      .then(() => {
        this.didPresent.emit(event);
        this.modalStreamService.presented$.next(event);
      });
  }

  private dismiss(event: ModalEvent): void {
    this.willDismiss.emit(event);
    this.resizeContainer(this.breakpoints.closed)
      .then(() => {
        this.hideElements();
        this.didDismiss.emit(event);
        this.modalStreamService.dismissed$.next(event);
      });
  }

  private getScreenSize(): { width: number; height: number } {
    const size = { width: 0, height: 0 };
    if ((<any>window).cordova) {
      console.log('cordova');
      size.width = screen.width;
      size.height = screen.height;
    } else {
      size.width = screen.width;
      size.height = document.body.clientHeight;
      if (!size.height) {
        size.height = screen.height;
      }
    }
    return size;
  }

}
