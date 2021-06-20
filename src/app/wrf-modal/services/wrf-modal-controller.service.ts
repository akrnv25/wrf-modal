import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  component: Type<any>;
  componentProps?: { [key: string]: any };
  onWillPresent?: () => void;
  onDidPresent?: () => void;
  onWillDismiss?: () => void;
  onDidDismiss?: () => void;
  id?: string;
}

@Injectable()
export class WrfModalControllerService {

  toPresent$: Subject<ModalConfig> = new Subject();
  toClose$: Subject<string> = new Subject();

  private configs: ModalConfig[] = [];

  constructor() {
  }

  present(config: ModalConfig): string {
    const id = `${Date.now()}`;
    this.toPresent$.next({ ...config, id });
    return id;
  }

  close(id: string): void {
    const configExists = this.configs.some(config => config.id === id);
    if (configExists) {
      this.toClose$.next(id);
    }
  }

  closeAll(): void {
    this.configs.forEach(config => this.toClose$.next(config.id));
  }

}
