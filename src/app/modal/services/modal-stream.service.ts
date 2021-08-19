import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { Modal, ModalConfig, ModalEvent } from './modal-controller.service';

@Injectable()
export class ModalStreamService {

  toCreate$: Subject<ModalConfig> = new Subject();
  created$: ReplaySubject<Modal> = new ReplaySubject();
  toPresent$: Subject<ModalEvent> = new Subject();
  presented$: ReplaySubject<ModalEvent> = new ReplaySubject();
  toDismiss$: Subject<ModalEvent> = new Subject();
  dismissed$: ReplaySubject<ModalEvent> = new ReplaySubject();

}
