import {CardModel} from './Card.model';

export class DeckModel {
  id: number;
  name: string;
  cards: CardModel[];

  constructor(deck: any) {
    this.id = deck.id;
    this.name = deck.name;
    this.cards = deck.cards;
  }

  printCards(): string {
    return this.cards.map(card => card.value).join(', ');
  }
}
