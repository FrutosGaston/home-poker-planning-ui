import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../services/task.service';
import {DeckModel} from '../../../../models/Deck.model';
import {DeckService} from '../../../../services/deck.service';
import {EstimationModel} from '../../../../models/Estimation.model';
import {CardModel} from '../../../../models/Card.model';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-estimation-form',
  templateUrl: './estimation-form.component.html',
  styleUrls: ['./estimation-form.component.scss'],
  animations: [
    trigger('slideUp', [
      state('true', style({
        transform: 'translateY(110%)'
      })),
      state('false', style({
        display: 'translateY(0%)'
      })),
      transition('true=>false', [
        style({transform: 'translateY(110%)'}),
        animate('300ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition('false=>true', [
        animate('300ms ease-in', style({transform: 'translateY(110%)'}))
      ])
    ])
  ]
})
export class EstimationFormComponent implements OnInit {
  estimationForm: FormGroup;
  state: string;
  @Input() guestUserId: number;
  @Input() deckId: number;
  @Input() isFinal: boolean;
  @Input() hidden = true;

  // tslint:disable-next-line:variable-name
  _taskId: number;
  deck: DeckModel;

  constructor(private taskService: TaskService,
              private deckService: DeckService,
              private formBuilder: FormBuilder) { }

  @Input() set taskId(taskId: number) {
    this._taskId = taskId;
    if (this.estimationForm) { this.estimationForm.reset(); }
  }

  get taskId(): number {
    return this._taskId;
  }

  ngOnInit(): void {
    this.deckService.findDecks().subscribe(decks => this.deck = decks.find(deck => deck.id === this.deckId));
    this.estimationForm = this.formBuilder.group({
      cardId: [null, [Validators.required]],
    });
  }

  estimate(): void {
    if (!this.estimationForm.valid) { return; }
    const estimation = new EstimationModel();
    estimation.guestUserId = this.guestUserId;
    estimation.taskId = this.taskId;
    estimation.cardId = this.estimationForm.value.cardId;
    this.taskService.estimateFinal(estimation).subscribe();
  }

  cardSelected(card: CardModel): void {
    const estimation = new EstimationModel();
    estimation.guestUserId = this.guestUserId;
    estimation.taskId = this.taskId;
    estimation.cardId = card.id;
    this.taskService.estimate(estimation).subscribe();
  }
}
