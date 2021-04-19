import { Component, OnInit } from '@angular/core';
import {GuestUserService} from '../../../../services/guest-user.service';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../services/task.service';
import {EstimationModel, TaskModel} from '../../../../models/Task.model';
import {combineLatest} from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  loggedUser: GuestUserModel;
  usersInRoom: GuestUserModel[];
  estimationForm: FormGroup;
  currentTask: TaskModel;
  taskVotedByAll = false;
  tasks: TaskModel[];
  private manuallySelectedTask = false;

  constructor(private guestUserService: GuestUserService,
              private taskService: TaskService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loggedUser = this.guestUserService.loggedGuestUser || this.fakeUser();
    if (!this.loggedUser) { return; }
    const currentRoom = this.loggedUser.roomId;

    const users$ = this.guestUserService.findByRoom(currentRoom);
    const tasks$ = this.taskService.getByRoom(currentRoom);

    combineLatest([users$, tasks$]).subscribe(results => {
      this.usersInRoom = results[0];
      this.tasks = results[1].sort(TaskModel.dateComparator);
      if (!this.manuallySelectedTask) {
        this.currentTask = this.getCurrentTask();
      }
      this.taskVotedByAll = this.currentTask.votedByAll(this.usersInRoom);
    });

    this.estimationForm = this.formBuilder.group({
      points: [null, [Validators.required]],
    });
  }

  private getCurrentTask(): TaskModel {
    return this.tasks.find(task => !task.done());
  }

  estimate(): void {
    if (!this.estimationForm.valid) {
      return;
    }
    const estimation = new EstimationModel();
    estimation.guestUserId = this.loggedUser.id;
    estimation.taskId = this.currentTask.id;
    estimation.name = this.estimationForm.value.points;
    this.taskService.estimate(estimation).subscribe(_ => {});
  }

  private fakeUser(): GuestUserModel {
    const fakeUser = new GuestUserModel();
    fakeUser.roomId = 1;
    fakeUser.name = 'Gaston';
    fakeUser.id = 34;
    return fakeUser;
  }

  getEstimation(id: number): EstimationModel {
    return this.currentTask.estimations.find(estimation => estimation.guestUserId === id);
  }

  taskSelected($event: MouseEvent, task: TaskModel): void {
    this.manuallySelectedTask = true;
    this.currentTask = task;
  }
}
