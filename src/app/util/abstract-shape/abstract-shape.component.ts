import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-abstract-shape',
  templateUrl: './abstract-shape.component.html',
  styleUrls: ['./abstract-shape.component.scss']
})
export class AbstractShapeComponent implements OnInit {

  @Input() id: string;
  @Input() initialShape: string;
  @Input() finalShape: string;
  @Input() color: string;
  @Input() duration: number;

  finalLoopedShape: string;

  constructor() { }

  ngOnInit() {
    this.finalLoopedShape = this.initialShape + ';' + this.finalShape + ';' + this.initialShape;
  }

}
