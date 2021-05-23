import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../services/task.service';
import {DeckModel} from '../../../../models/Deck.model';
import {DeckService} from '../../../../services/deck.service';
import {EstimationModel} from '../../../../models/Estimation.model';

@Component({
  selector: 'app-estimation-form',
  templateUrl: './estimation-form.component.html',
  styleUrls: ['./estimation-form.component.scss']
})
export class EstimationFormComponent implements OnInit {
  estimationForm: FormGroup;
  @Input() guestUserId: number;
  @Input() deckId: number;
  @Input() isFinal: boolean;

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
    if (this.isFinal) {
      this.taskService.estimateFinal(estimation).subscribe(_ => {});
    } else {
      this.taskService.estimate(estimation).subscribe(_ => {});
    }
  }

}
