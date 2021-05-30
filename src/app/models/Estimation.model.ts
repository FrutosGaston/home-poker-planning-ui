import {CardModel} from './Card.model';

export class EstimationModel {
  id?: number;
  name: string;
  card?: CardModel;
  cardId?: number;
  guestUserId: number;
  taskId: number;
  createdAt?: Date;
  active?: boolean;
}
