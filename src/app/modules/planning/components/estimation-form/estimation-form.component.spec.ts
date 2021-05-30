import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { EstimationFormComponent } from './estimation-form.component';
import {TranslatePipeStub} from '../../../../stubs/translate-pipe.stub';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../stubs/router.stub';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {TaskService} from '../../../../services/task.service';
import {DeckService} from '../../../../services/deck.service';
import {DeckModel} from '../../../../models/Deck.model';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {CardModel} from '../../../../models/Card.model';

describe('EstimationFormComponent', () => {
  let component: EstimationFormComponent;
  let cardIdField;
  let fixture: ComponentFixture<EstimationFormComponent>;
  let taskServiceSpy;
  let deckServiceSpy;

  beforeEach(waitForAsync(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['estimate', 'estimateFinal']);
    deckServiceSpy = jasmine.createSpyObj('DeckService', ['findDecks']);
    await TestBed.configureTestingModule({
      declarations: [ EstimationFormComponent, TranslatePipeStub ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: DeckService, useValue: deckServiceSpy },
        { provide: Router, useClass: RouterStub}
      ],
      imports: [
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule
      ]    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EstimationFormComponent);
        component = fixture.componentInstance;
        jasmine.createSpyObj('TaskService', ['estimate']);
        taskServiceSpy.estimate.and.returnValue(of(1));
        taskServiceSpy.estimateFinal.and.returnValue(of(1));
        deckServiceSpy.findDecks.and.returnValue(of([new DeckModel({id: 1, name: 'fibonacci', cards: [{value: 1}]})]));
        fixture.detectChanges();
      });
  }));

  it('should validate name is required', () => {
    cardIdField = component.estimationForm.controls.cardId;
    expect(cardIdField.errors.required).toBeTrue();
    cardIdField.setValue('1');
    expect(cardIdField.errors && cardIdField.errors.required).toBeNull();
  });

  it('should not call task service when submits an invalid form', () => {
    expect(component.estimationForm.valid).toBeFalse();

    component.estimate();

    expect(taskServiceSpy.estimate).not.toHaveBeenCalled();
  });

  it('should call task service when submits a valid form', () => {
    cardIdField = component.estimationForm.controls.cardId;
    cardIdField.setValue('1');
    expect(component.estimationForm.valid).toBeTrue();
    const card: CardModel = { id: 1, deckId: 1, value: '3' };

    component.cardSelected(card);

    expect(taskServiceSpy.estimate).toHaveBeenCalled();
  });

  it('should call task service when submits a valid form and is final', () => {
    cardIdField = component.estimationForm.controls.cardId;
    cardIdField.setValue('1');
    expect(component.estimationForm.valid).toBeTrue();

    component.isFinal = true;
    component.estimate();

    expect(taskServiceSpy.estimateFinal).toHaveBeenCalled();
  });
});
