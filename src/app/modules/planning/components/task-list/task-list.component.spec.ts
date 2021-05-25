import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';
import {EstimationFormComponent} from '../estimation-form/estimation-form.component';
import {TranslatePipeStub} from '../../../../stubs/translate-pipe.stub';
import {TaskService} from '../../../../services/task.service';
import {DeckService} from '../../../../services/deck.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../stubs/router.stub';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {of} from 'rxjs';
import {DeckModel} from '../../../../models/Deck.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy;

  beforeEach(waitForAsync(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['create']);
    await TestBed.configureTestingModule({
      declarations: [ TaskListComponent, TranslatePipeStub ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy }
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
        fixture = TestBed.createComponent(TaskListComponent);
        component = fixture.componentInstance;
        jasmine.createSpyObj('TaskService', ['create']);
        taskServiceSpy.create.and.returnValue(of(1));
        fixture.detectChanges();
      });
  }));

  it('should validate name is required', () => {
    const titleField = component.taskForm.controls.title;
    expect(titleField.errors.required).toBeTrue();
    titleField.setValue('1');
    expect(titleField.errors && titleField.errors.required).toBeNull();
  });

  it('should not call task service when submits an invalid form', () => {
    expect(component.taskForm.valid).toBeFalse();

    component.createTask();

    expect(taskServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should call task service when submits a valid form', () => {
    const titleField = component.taskForm.controls.title;
    titleField.setValue('1');
    expect(component.taskForm.valid).toBeTrue();

    component.createTask();

    expect(taskServiceSpy.create).toHaveBeenCalled();
  });
});
