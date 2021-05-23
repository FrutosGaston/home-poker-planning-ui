import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskModel} from '../../../../models/Task.model';
import {MatSidenav} from '@angular/material/sidenav';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  @Input() tasks: TaskModel[];
  @Input() sidenav: MatSidenav;
  @Input() currentTask: TaskModel;
  @Input() roomId: number;
  @Output() taskSelectedEvent = new EventEmitter<TaskModel>();
  taskForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: [null, [Validators.required]],
    });
  }

  taskSelected($event, task): void {
    this.taskSelectedEvent.emit(task);
  }

  createTask(): void {
    if (!this.taskForm.valid) { return; }
    const task: TaskModel = { title: this.taskForm.value.title, roomId: this.roomId } as TaskModel;
    this.taskService.create(task).subscribe(_ => this.taskForm.reset());
  }
}
