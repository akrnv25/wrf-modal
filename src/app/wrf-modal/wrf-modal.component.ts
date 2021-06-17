import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Gesture, GestureController, GestureDetail } from '@ionic/angular';

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

@Component({
  selector: 'app-wrf-modal',
  templateUrl: './wrf-modal.component.html',
  styleUrls: ['./wrf-modal.component.scss']
})
export class WrfModalComponent implements OnInit, AfterViewInit {

  private breakpoints: ModalBreakpoints;
  private modal: HTMLElement;
  private backdrop: HTMLElement;
  private container: HTMLElement;

  constructor(
    private gestureController: GestureController,
    private renderer2: Renderer2,
    private elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.calcBreakpoints();
      this.showBackdrop();
      this.showContainer();
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.initElements();
    this.useContainerSwipe();
  }

  private initElements(): void {
    this.modal = this.elementRef.nativeElement.querySelector('.wrf-modal');
    this.backdrop = this.modal.querySelector('.wrf-modal__backdrop');
    this.container = this.modal.querySelector('.wrf-modal__container');
  }

  private useContainerSwipe(): void {
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
        let top: number;
        switch (direction) {
          case SwipeDirection.UP:
            top = this.breakpoints.fullSize;
            break;
          case SwipeDirection.DOWN:
            const { y } = this.container.getBoundingClientRect();
            top = this.breakpoints.needClose < y ? this.breakpoints.closed : this.breakpoints.partialSize;
            break;
        }
        this.pushContainer(top);
      }
    });
    gesture.enable(true);
  }

  private calcBreakpoints(): void {
    const height = this.modal.clientHeight;
    this.breakpoints = {
      fullSize: 0,
      partialSize: Math.round(height * 0.5),
      needClose: Math.round(height * 0.75),
      closed: height
    };
  }

  private showBackdrop(): void {
    this.renderer2.setStyle(this.backdrop, 'display', 'block');
  }

  private showContainer(): void {
    this.renderer2.setStyle(this.container, 'display', 'block');
    this.pushContainer(this.breakpoints.partialSize);
  }

  private pushContainer(top: number): void {
    this.renderer2.setStyle(this.container, 'transition', '300ms ease-in');
    setTimeout(() => {
      this.renderer2.setStyle(this.container, 'top', `${top}px`);
    }, 0);
  }

}
