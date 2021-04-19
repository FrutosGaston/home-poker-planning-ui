import {GuestUserModel} from './GuestUser.model';

export class EstimationModel {
  id: number;
  name: string;
  guestUserId: number;
  taskId: number;
  createdAt: Date;
}

export class TaskModel {
  id: number;
  title: string;
  finalEstimation: string;
  estimations: EstimationModel[];
  createdAt: Date;

  constructor(task: any) {
    this.id = task.id;
    this.title = task.title;
    this.estimations = task.estimations;
    this.finalEstimation = task.finalEstimation;
    this.createdAt = task.createdAt;
  }

  static dateComparator(task1, task2): number {
    return task1.createdAt - task2.createdAt;
  }

  votedByAll(users: GuestUserModel[]): boolean {
    return users.every(user => this.estimations.some(estimation => estimation.guestUserId === user.id));
  }

  done(): boolean {
    return !!this.finalEstimation;
  }
}
