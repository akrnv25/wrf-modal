import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { Modal, ModalConfig, ModalEvent } from './modal-controller.service';

@Injectable()
export class ModalStreamService {

  public toCreate$: Subject<ModalConfig> = new Subject();
  public created$: ReplaySubject<Modal> = new ReplaySubject();
  public toPresent$: Subject<ModalEvent> = new Subject();
  public presented$: ReplaySubject<ModalEvent> = new ReplaySubject();
  public toDismiss$: Subject<ModalEvent> = new Subject();
  public dismissed$: ReplaySubject<ModalEvent> = new ReplaySubject();

}
