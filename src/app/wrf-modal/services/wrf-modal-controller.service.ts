import { Component, Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface Modal<D = any> {
  present: () => void;
  onDidDismiss: () => Promise<D>;
}

interface ModalConfig {
  component: Type<Component>;
}

interface ModalToCreate {
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
  createdModal: Subject<CreatedModal> = new Subject();

  constructor() {
  }

  create(config: ModalConfig): Promise<Modal> {
    const id = `${Date.now()}`;
    this.modalToCreate.next({ config, id });
    return this.createdModal
      .pipe(
        filter(createdModal => createdModal.id === id),
        map(createdModal => createdModal.modal)
      )
      .toPromise();
  }

}
