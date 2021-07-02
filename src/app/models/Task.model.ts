import {GuestUserModel} from './GuestUser.model';
import {EstimationModel} from './Estimation.model';

export class TaskModel {
  id?: number;
  roomId?: number;
  title: string;
  estimation?: EstimationModel;
  estimations?: EstimationModel[];
  createdAt?: Date;

  constructor(task: any) {
    this.id = task.id;
    this.roomId = task.roomId;
    this.title = task.title;
    this.estimations = task.estimations;
    this.estimation = task.estimation;
    this.createdAt = task.createdAt;
  }

  static dateComparator(task1, task2): number {
    return task1.createdAt - task2.createdAt;
  }

  votedByAll(users: GuestUserModel[]): boolean {
    return users.every(user => this.estimations.some(estimation => estimation.active && estimation.guestUserId === user.id));
  }

  done(): boolean {
    return !!this.estimation;
  }
}
