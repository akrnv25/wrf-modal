import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ModalComponent } from '../../../wrf-modal/components/wrf-modal/wrf-modal.component';

@Component({
  selector: 'app-tab1-modal',
  templateUrl: './tab1-modal.component.html',
  styleUrls: ['./tab1-modal.component.scss']
})
export class Tab1ModalComponent implements OnInit, OnDestroy, OnChanges, ModalComponent {

  @Input() prop1: string;
  @Input() prop2: number;
  @Input() prop3: any[];
  @Input() prop4: { [key: string]: any };

  @Output() dismiss: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.prop1);
    console.log(this.prop2);
    console.log(this.prop3);
    console.log(this.prop4);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy(): void {
    console.log('tab1-modal component destroyed');
  }

  onDismiss(): void {
    this.dismiss.emit({ result: 'Alex' });
  }

}
