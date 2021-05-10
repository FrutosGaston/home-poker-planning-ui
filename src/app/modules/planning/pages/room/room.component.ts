import { Component, OnInit } from '@angular/core';
import {GuestUserService} from '../../../../services/guest-user.service';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../services/task.service';
import {EstimationModel, TaskModel} from '../../../../models/Task.model';
import {combineLatest} from 'rxjs';
import {RoomService} from '../../../../services/room.service';
import {RoomModel} from '../../../../models/Room.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  loggedUser: GuestUserModel;
  usersInRoom: GuestUserModel[];
  estimationForm: FormGroup;
  finalEstimationForm: FormGroup;
  currentTask: TaskModel;
  taskVotedByAll = false;
  tasks: TaskModel[];
  taskDone: boolean;
  room: RoomModel;

  constructor(private guestUserService: GuestUserService,
              private taskService: TaskService,
              private roomService: RoomService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loggedUser = this.guestUserService.loggedGuestUser || this.fakeUser();
    if (!this.loggedUser) { return; }
    this.roomService.get(this.loggedUser.roomId).subscribe(room => {
      this.room = room;
      this.setupState();
      this.bindGuestUserCreated();
      this.bindEstimationCreated();
      this.bindTaskUpdated();
      this.setupForms();
    });
  }

  private setupState(): void {
    const currentRoom = this.getRoomId();
    const users$ = this.guestUserService.findByRoom(currentRoom);
    const tasks$ = this.taskService.getByRoom(currentRoom);

    combineLatest([users$, tasks$]).subscribe(results => {
      this.usersInRoom = results[0];
      this.tasks = results[1].sort(TaskModel.dateComparator);
      this.setCurrentTask();
    });
  }

  private updateTaskState(): void {
    this.taskDone = this.currentTask.done();
    this.taskVotedByAll = this.currentTask.votedByAll(this.usersInRoom);
  }

  private setCurrentTask(): void {
    if (!this.currentTask) {
      this.currentTask = this.getCurrentTask();
    } else {
      this.currentTask = this.tasks.find(task => task.id === this.currentTask.id);
    }
    this.updateTaskState();
  }

  private setupForms(): void {
    this.estimationForm = this.formBuilder.group({
      points: [null, [Validators.required]],
    });
    this.finalEstimationForm = this.formBuilder.group({
      points: [null, [Validators.required]],
    });
  }

  private getCurrentTask(): TaskModel {
    return this.tasks.find(task => !task.done()) || this.tasks[0];
  }

  estimate(): void {
    if (!this.estimationForm.valid) { return; }
    const estimation = new EstimationModel();
    estimation.guestUserId = this.loggedUser.id;
    estimation.taskId = this.currentTask.id;
    estimation.name = this.estimationForm.value.points;
    this.taskService.estimate(estimation).subscribe(_ => {});
  }

  finalEstimation(): void {
    if (!this.finalEstimationForm.valid) { return; }
    this.currentTask.finalEstimation = this.finalEstimationForm.value.points;
    this.taskService.updateTask(this.currentTask).subscribe(_ => {});
  }

  private fakeUser(): GuestUserModel {
    const fakeUser = new GuestUserModel();
    fakeUser.roomId = 1;
    fakeUser.name = 'Gaston';
    fakeUser.id = 34;
    return fakeUser;
  }

  getEstimation(id: number): EstimationModel {
    return this.currentTask.estimations && this.currentTask.estimations.find(estimation => estimation.guestUserId === id);
  }

  taskSelected($event: MouseEvent, task: TaskModel): void {
    this.currentTask = task;
    this.updateTaskState();
    this.finalEstimationForm.reset();
    this.estimationForm.reset();
  }

  private bindGuestUserCreated(): void {
    this.guestUserService.onNewGuestUser(this.getRoomId()).subscribe((guestUser) => {
      this.usersInRoom.push(guestUser);
      this.updateTaskState();
    });
  }

  private bindEstimationCreated(): void {
    this.taskService.onNewEstimation(this.getRoomId()).subscribe((estimation) => {
      const estimationTask = this.tasks.find(task => task.id === estimation.taskId);
      estimationTask.estimations.push(estimation);
      this.updateTaskState();
    });
  }

  private bindTaskUpdated(): void {
    this.taskService.onTaskUpdated(this.getRoomId()).subscribe((updatedTask) => {
      const taskIndex = this.tasks.findIndex(task => task.id === updatedTask.id);
      const taskToUpdate = this.tasks[taskIndex];
      taskToUpdate.finalEstimation = updatedTask.finalEstimation;
      taskToUpdate.title = updatedTask.title;
      this.updateTaskState();
    });
  }

  private getRoomId(): number {
    return this.room.id;
  }
}
