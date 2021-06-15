import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {EstimationModel} from '../../../../models/Estimation.model';
import {TaskModel} from '../../../../models/Task.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-user-in-room',
  templateUrl: './user-in-room.component.html',
  styleUrls: ['./user-in-room.component.scss'],
  animations: [
    trigger('flipCard', [
      state('true', style({
        transform: 'rotateY(180deg)'
      })),
      state('false', style({
        transform: 'none'
      })),
      transition('true => false', animate('500ms')),
      transition('false => true', animate('500ms'))
    ]),
    trigger('firstRender', [
      transition(':enter', [])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(500%)' }),
        animate('500ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('500ms ease-in', style({ transform: 'translateY(500%)' }))
      ])
    ])
  ]
})
export class UserInRoomComponent implements OnInit {

  @Input() user: GuestUserModel;

  @Input() taskVotedByAll: boolean;

  @Input() taskDone: boolean;

  @Input() estimation: EstimationModel;

  @Input() currentTask: TaskModel;

  @Input() loggedUser: GuestUserModel;

  @Input() positionToDesk: string;

  constructor() { }

  ngOnInit(): void {
  }


}
