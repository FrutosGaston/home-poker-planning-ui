import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../services/task.service';
import {DeckModel} from '../../../../models/Deck.model';
import {DeckService} from '../../../../services/deck.service';
import {EstimationModel} from '../../../../models/Estimation.model';
import {CardModel} from '../../../../models/Card.model';
import {DragScrollComponent} from 'ngx-drag-scroll';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-estimation-form',
  templateUrl: './estimation-form.component.html',
  styleUrls: ['./estimation-form.component.scss'],
  animations: [
    trigger('slideDown', [
      transition('closed=>opened', [
        style({bottom: '0'}),
        animate('500ms ease-in', style({bottom: '290px'}))
      ]),
      transition('opened=>closed', [
        style({bottom: '290px'}),
        animate('500ms ease-in', style({bottom: '0'}))
      ]),
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('500ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({transform: 'translateY(100%)'}))
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
  @ViewChild('cardscroll', {read: DragScrollComponent}) ds: DragScrollComponent;

  // tslint:disable-next-line:variable-name
  _taskId: number;
  deck: DeckModel;

  constructor(private taskService: TaskService,
              private deckService: DeckService,
              private formBuilder: FormBuilder) { }

  @Input() set open(show: boolean) {
    this.state = show ? 'opened' : 'closed';
  }

  get open(): boolean {
    return this.state === 'opened';
  }

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
    this.taskService.estimateFinal(estimation).subscribe(_ => {});
  }

  cardSelected(card: CardModel): void {
    const estimation = new EstimationModel();
    estimation.guestUserId = this.guestUserId;
    estimation.taskId = this.taskId;
    estimation.cardId = card.id;
    this.taskService.estimate(estimation).subscribe(_ => {});
  }

  toggle(): void {
    this.state = this.state === 'opened' ? 'closed' : 'opened';
  }

  moveLeft(): void {
    this.ds.moveLeft();
  }

  moveRight(): void {
    this.ds.moveRight();
  }

}
