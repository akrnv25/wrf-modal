import { Injectable, Type } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

export interface Modal<D = any> {
  present: () => void;
  onDidDismiss: () => Promise<D>;
}

export interface ModalConfig {
  component: Type<any>;
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
        map(createdModal => createdModal.modal),
        first()
      )
      .toPromise();
  }

}
