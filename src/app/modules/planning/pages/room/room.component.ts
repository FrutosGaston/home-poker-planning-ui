import {Component, OnInit} from '@angular/core';
import {GuestUserService} from '../../../../services/guest-user.service';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {TaskService} from '../../../../services/task.service';
import {TaskModel} from '../../../../models/Task.model';
import {combineLatest} from 'rxjs';
import {RoomService} from '../../../../services/room.service';
import {RoomModel} from '../../../../models/Room.model';
import {ActivatedRoute} from '@angular/router';
import {EstimationModel} from '../../../../models/Estimation.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  loggedUser: GuestUserModel;
  usersInRoom: GuestUserModel[];
  currentTask: TaskModel;
  taskVotedByAll = false;
  tasks: TaskModel[];
  taskDone: boolean;
  room: RoomModel;
  splittedUsers: { below: GuestUserModel[]; left: GuestUserModel[]; above: GuestUserModel[]; right: GuestUserModel[] };
  validUser = false;

  constructor(private guestUserService: GuestUserService,
              private taskService: TaskService,
              private roomService: RoomService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loggedUser = this.guestUserService.loggedGuestUser;
    if (!this.loggedUser) { return; }

    this.route.params.subscribe(params => {
      this.roomService.getByUUID(params.uuid).subscribe(room => {
        this.validUser = this.loggedUser.roomId.toString() === room.id.toString();
        this.room = room;
        this.setupState();
        this.bindEvents();
      });
    });
  }

  private setupState(): void {
    const currentRoomId = this.getRoomId();
    const users$ = this.guestUserService.findByRoom(currentRoomId);
    const tasks$ = this.taskService.getByRoom(currentRoomId);

    combineLatest([users$, tasks$]).subscribe(results => {
      this.usersInRoom = results[0];
      this.updateUsersInRoomState();
      this.tasks = results[1].sort(TaskModel.dateComparator);
      this.setCurrentTask();
    });
  }

  private updateUsersInRoomState(): void {
    const usersInRoom = this.usersInRoom;
    const halfwayThrough = Math.floor(usersInRoom.length / 2);
    const usersAbove = usersInRoom.slice(0, halfwayThrough - 1);
    const usersLeft = usersInRoom.slice(halfwayThrough - 1, halfwayThrough);
    const usersRight = usersInRoom.slice(halfwayThrough, halfwayThrough + 1);
    const usersBelow = usersInRoom.slice(halfwayThrough + 1, usersInRoom.length);
    this.splittedUsers = { above: usersAbove, below: usersBelow, left: usersLeft, right: usersRight };
  }

  private updateTaskState(): void {
    if (!this.currentTask) { return; }
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

  private getCurrentTask(): TaskModel {
    return this.tasks.find(task => !task.done()) || this.tasks[0];
  }

  getEstimation(id: number): EstimationModel {
    return this.currentTask &&
      this.currentTask.estimations &&
      this.currentTask.estimations.find(estimation => estimation.active && estimation.guestUserId === id);
  }

  taskSelected(task: TaskModel): void {
    this.roomService.update(this.room.id, { selectedTaskId: task.id }).subscribe();
    this.updateTaskState();
  }

  private bindGuestUserCreated(): void {
    this.guestUserService.onNewGuestUser(this.getRoomId()).subscribe((guestUser) => {
      this.usersInRoom.push(guestUser);
      this.updateUsersInRoomState();
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

  private bindTaskCreated(): void {
    this.taskService.onNewTask(this.getRoomId()).subscribe((task) => {
      this.tasks.push(task);
      this.setCurrentTask();
      this.updateTaskState();
    });
  }

  private bindTaskUpdated(): void {
    this.taskService.onTaskEstimated(this.getRoomId()).subscribe((updatedTask) => {
      const taskIndex = this.tasks.findIndex(task => task.id === updatedTask.id);
      const taskToUpdate = this.tasks[taskIndex];
      taskToUpdate.estimation = updatedTask.estimation;
      this.updateTaskState();
    });
  }

  private bindEstimationsInvalidated(): void {
    this.taskService.onEstimationsInvalidated(this.getRoomId()).subscribe((updatedTask) => {
      const taskIndex = this.tasks.findIndex(task => task.id === updatedTask.id);
      const taskToUpdate = this.tasks[taskIndex];
      taskToUpdate.estimations = updatedTask.estimations;
      this.updateTaskState();
    });
  }

  private bindRoomUpdated(): void {
    this.roomService.onRoomUpdated(this.getRoomId()).subscribe((updatedRoom) => {
      this.currentTask = this.tasks.find(task => task.id === updatedRoom.selectedTaskId);
      this.updateTaskState();
    });
  }

  private getRoomId(): number {
    return this.room.id;
  }

  private bindEvents(): void {
    this.bindGuestUserCreated();
    this.bindEstimationCreated();
    this.bindTaskCreated();
    this.bindTaskUpdated();
    this.bindEstimationsInvalidated();
    this.bindRoomUpdated();
  }

  resetEstimations(): void {
    this.taskService.invalidateEstimations(this.currentTask.id).subscribe();
  }
}
