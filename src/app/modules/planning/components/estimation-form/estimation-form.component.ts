import {Component, Input, OnInit} from '@angular/core';
import {EstimationModel} from '../../../../models/Task.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../services/task.service';

@Component({
  selector: 'app-estimation-form',
  templateUrl: './estimation-form.component.html',
  styleUrls: ['./estimation-form.component.scss']
})
export class EstimationFormComponent implements OnInit {
  estimationForm: FormGroup;
  @Input() guestUserId: number;

  // tslint:disable-next-line:variable-name
  _taskId: number;

  constructor(private taskService: TaskService,
              private formBuilder: FormBuilder) { }

  @Input() set taskId(taskId: number) {
    this._taskId = taskId;
    this.estimationForm.reset();
  }

  get taskId(): number {
    return this._taskId;
  }

  ngOnInit(): void {
    this.estimationForm = this.formBuilder.group({
      points: [null, [Validators.required]],
    });
  }

  estimate(): void {
    if (!this.estimationForm.valid) { return; }
    const estimation = new EstimationModel();
    estimation.guestUserId = this.guestUserId;
    estimation.taskId = this.taskId;
    estimation.name = this.estimationForm.value.points;
    this.taskService.estimate(estimation).subscribe(_ => {});
  }

}
