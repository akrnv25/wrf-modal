import { Injectable, Type } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

export interface ModalConfig {
  component: Type<any>;
  componentProps?: { [key: string]: any };
  swipeToClose: boolean;
  showBackdrop: boolean;
  heightPart: number;
  id?: string;
}

export interface Modal {
  onWillPresent: Promise<ModalEvent>;
  onDidPresent: Promise<ModalEvent>;
  onWillDismiss: Promise<ModalEvent>;
  onDidDismiss: Promise<ModalEvent>;
  id: string;
}

export interface ModalEvent {
  id: string;
  data?: any;
  role?: string;
}

@Injectable()
export class ModalControllerService {

  toCreate$: Subject<ModalConfig> = new Subject();
  created$: ReplaySubject<Modal> = new ReplaySubject();
  toPresent$: Subject<ModalEvent> = new Subject();
  presented$: ReplaySubject<ModalEvent> = new ReplaySubject();
  toDismiss$: Subject<ModalEvent> = new Subject();
  dismissed$: ReplaySubject<ModalEvent> = new ReplaySubject();

  private modals: Modal[] = [];

  constructor() {
  }

  create(config: ModalConfig): Promise<Modal> {
    const id = `${Date.now()}`;
    this.toCreate$.next({ ...config, id });
    return this.created$
      .asObservable()
      .pipe(
        filter((modal: Modal) => modal.id === id),
        take(1),
        tap((modal: Modal) => this.modals.push(modal))
      )
      .toPromise();
  }

  present(id: string): Promise<ModalEvent> {
    if (this.isUndefined(id)) {
      return;
    }

    this.toPresent$.next({ id });
    return this.presented$
      .asObservable()
      .pipe(
        filter((event: ModalEvent) => event.id === id),
        take(1)
      )
      .toPromise();
  }

  dismiss(id: string, data: any = null): Promise<ModalEvent> {
    if (this.isUndefined(id)) {
      return;
    }

    this.toDismiss$.next({ id, data });
    return this.dismissed$
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

  dismissAll(): Promise<void> {
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
