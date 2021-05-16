import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { EstimationFormComponent } from './estimation-form.component';
import {TranslatePipeStub} from '../../../../stubs/translate-pipe.stub';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../stubs/router.stub';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {of} from 'rxjs';
import {TaskService} from '../../../../services/task.service';

describe('EstimationFormComponent', () => {
  let component: EstimationFormComponent;
  let pointsField;
  let fixture: ComponentFixture<EstimationFormComponent>;
  let taskServiceSpy;

  beforeEach(waitForAsync(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['create']);
    await TestBed.configureTestingModule({
      declarations: [ EstimationFormComponent, TranslatePipeStub ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useClass: RouterStub}
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ]    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EstimationFormComponent);
        component = fixture.componentInstance;
        jasmine.createSpyObj('TaskService', ['create']);
        taskServiceSpy.create.and.returnValue(of(1));
        fixture.detectChanges();
        pointsField = component.estimationForm.controls.points;
      });
  }));

  it('should validate name is required', () => {
    expect(pointsField.errors.required).toBeTrue();
    pointsField.setValue('1');
    expect(pointsField.errors && pointsField.errors.required).toBeNull();
  });

  it('should not call task service when submits an invalid form', () => {
    expect(component.estimationForm.valid).toBeFalse();

    component.estimate();

    expect(taskServiceSpy.create).not.toHaveBeenCalled();
  });

  it('should call task service when submits a valid form', () => {
    pointsField.setValue('1');
    expect(component.estimationForm.valid).toBeTrue();

    component.estimate();

    expect(taskServiceSpy.create).toHaveBeenCalled();
  });
});
