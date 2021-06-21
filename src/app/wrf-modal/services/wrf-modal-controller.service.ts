import { Injectable, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ModalEvent } from '../components/wrf-modal/wrf-modal.component';
import { ModalComponent } from '../components/wrf-modal-stack/wrf-modal-stack.component';

export interface ModalConfig {
  component: Type<ModalComponent>;
  componentProps?: { [key: string]: any };
  onWillPresent?: (event: ModalEvent) => void;
  onDidPresent?: (event: ModalEvent) => void;
  onWillDismiss?: (event: ModalEvent) => void;
  onDidDismiss?: (event: ModalEvent) => void;
  id?: string;
}

@Injectable()
export class WrfModalControllerService {

  private present$: Subject<ModalConfig> = new Subject();
  get toPresent$(): Observable<ModalConfig> {
    return this.present$.asObservable();
  }

  private dismiss$: Subject<ModalEvent> = new Subject();
  get toDismiss$(): Observable<ModalEvent> {
    return this.dismiss$.asObservable();
  }

  private configs: ModalConfig[] = [];

  constructor() {
  }

  present(config: ModalConfig): string {
    const id = `${Date.now()}`;
    this.present$.next({ ...config, id });
    this.configs.push({ ...config, id });
    return id;
  }

  dismiss(id: string, data: any = null): void {
    const configExists = this.configs.some(config => config.id === id);
    if (configExists) {
      this.dismiss$.next({ id, data });
      this.configs = this.configs.filter(config => config.id !== id);
    }
  }

  dismissAll(): void {
    this.configs.forEach(config => {
      this.dismiss$.next({ id: config.id, data: null });
    });
  }

}
