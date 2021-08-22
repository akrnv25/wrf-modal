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

  public dismissAll(): Promise<void> {
    return new Promise(resolve => {
      this.modals.forEach(async modal => {
        await this.dismiss(modal.id);
      });
      resolve();
    });
  }

  private isUndefined(id: string): boolean {
    return this.modals.every(modal => modal.id !== id);
  }

}
