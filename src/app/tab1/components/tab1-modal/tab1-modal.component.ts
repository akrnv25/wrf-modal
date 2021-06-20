import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1-modal',
  templateUrl: './tab1-modal.component.html',
  styleUrls: ['./tab1-modal.component.scss']
})
export class Tab1ModalComponent implements OnInit {

  @Input() prop1: string;
  @Input() prop2: number;
  @Input() prop3: any[];
  @Input() prop4: { [key: string]: any };

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.prop1);
    console.log(this.prop2);
    console.log(this.prop3);
    console.log(this.prop4);
  }

}
