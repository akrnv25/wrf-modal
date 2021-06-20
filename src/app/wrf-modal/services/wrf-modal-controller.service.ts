import { Injectable, Type } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export interface Modal<D = any> {
  present: () => void;
  onDismiss: () => Promise<D>;
}

export interface ModalConfig {
  component: Type<any>;
  componentProps?: { [key: string]: any };
}

export interface ModalToCreate {
  config: ModalConfig;
  id: string;
}

interface CreatedModal {
  modal: Modal;
  id: string;
}

@Injectable()
export class WrfModalControllerService {

  modalToCreate: Subject<ModalToCreate> = new Subject();
  createdModal: ReplaySubject<CreatedModal> = new ReplaySubject();

  constructor() {
  }

  create(config: ModalConfig): Promise<Modal> {
    const id = `${Date.now()}`;
    this.modalToCreate.next({ config, id });
    return this.createdModal
      .asObservable()
      .pipe(
        filter(createdModal => createdModal.id === id),
        take(1),
        map(createdModal => createdModal.modal)
      )
      .toPromise();
  }

}
