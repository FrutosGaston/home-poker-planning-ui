import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {EstimationModel} from '../../../../models/Estimation.model';
import {TaskModel} from '../../../../models/Task.model';

@Component({
  selector: 'app-user-in-room',
  templateUrl: './user-in-room.component.html',
  styleUrls: ['./user-in-room.component.scss']
})
export class UserInRoomComponent implements OnInit {

  @Input() user: GuestUserModel;

  @Input() taskVotedByAll: boolean;

  @Input() taskDone: boolean;

  @Input() estimation: EstimationModel;

  @Input() currentTask: TaskModel;

  @Input() loggedUser: GuestUserModel;

  @Output() toggleEstimationEvent = new EventEmitter<any>();

  @Input() positionToDesk: string;

  constructor() { }

  ngOnInit(): void {
  }

  toggleEstimation(): void {
    this.toggleEstimationEvent.emit();
  }
}
