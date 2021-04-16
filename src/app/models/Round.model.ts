import {GuestUserModel} from './GuestUser.model';

export class EstimationModel {
  id: number;
  name: string;
  guestUserId: number;
  roundId: number;
  createdAt: Date;
}

export class RoundModel {
  id: number;
  title: string;
  estimations: EstimationModel[];
  createdAt: Date;

  constructor(round: any) {
    this.id = round.id;
    this.title = round.title;
    this.estimations = round.estimations;
    this.createdAt = round.createdAt;
  }

  done(users: GuestUserModel[]): boolean {
    return users.every(user => this.estimations.some(estimation => estimation.guestUserId === user.id));
  }
}
