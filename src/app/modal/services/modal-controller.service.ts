import { Injectable, Type } from '@angular/core';
import { filter, take, tap } from 'rxjs/operators';
import { ModalStreamService } from './modal-stream.service';

export interface ModalConfig {
  component: Type<ModalContent>;
  componentProps: { [key: string]: any };
  swipeToClose: boolean;
  showBackdrop: boolean;
  swipeToExpand: boolean;
  clickBackdropToClose: boolean;
  heightPart: number;
  classes: string;
  id?: string;
}

export interface Modal {
  onWillPresent: Promise<ModalEvent>;
  onDidPresent: Promise<ModalEvent>;
  onWillDismiss: Promise<ModalEvent>;
  onDidDismiss: Promise<ModalEvent>;
  id: string;
}

export interface ModalEvent<D = any> {
  id: string;
  data?: D;
  role?: string;
}

export interface ModalContent {
  modalId: string;
}

@Injectable()
export class ModalControllerService {

  private modals: Modal[] = [];

  constructor(
    private modalStreamService: ModalStreamService,
  ) {
  }

  public create(config: ModalConfig): Promise<Modal> {
    const id = `${Date.now()}`;
    this.modalStreamService.toCreate$.next({ ...config, id });
    return this.modalStreamService.created$
      .asObservable()
      .pipe(
        filter((modal: Modal) => modal.id === id),
        take(1),
        tap((modal: Modal) => this.modals.push(modal))
      )
      .toPromise();
  }

  public present(id: string): Promise<ModalEvent> {
    if (this.isUndefined(id)) {
      return;
    }

    this.modalStreamService.toPresent$.next({ id });
    return this.modalStreamService.presented$
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === id),
        take(1)
      )
      .toPromise();
  }

  public dismiss<D = any>(id: string, data?: D, role?: string): Promise<ModalEvent> {
    if (this.isUndefined(id)) {
      return;
    }

    this.modalStreamService.toDismiss$.next({ id, data, role });
    return this.modalStreamService.dismissed$
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === id),
        take(1),
        tap((event: ModalEvent) => {
          this.modals = this.modals.filter(modal => modal.id !== event.id);
        })
      )
      .toPromise();
  }

  public dismissAll<D = any>(data?: D, role?: string): Promise<ModalEvent> {
      const lastModalIndex = this.modals.length - 1;
      const modalPromises = this.modals.map((modal: Modal, index: number) => {
          if (index === lastModalIndex) {
              return this.dismiss(modal.id, data, role);
          } else {
              return this.dismiss(modal.id);
          }
      });
      return Promise.all(modalPromises).then(events => events[lastModalIndex]);
  }

  private isUndefined(id: string): boolean {
    return this.modals.every(modal => modal.id !== id);
  }

}
