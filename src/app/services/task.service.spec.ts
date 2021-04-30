import {EstimationModel, TaskModel} from '../models/Task.model';
import {of, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {TaskService} from './task.service';

let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy, patch: jasmine.Spy };
let taskService: TaskService;

beforeEach(() => {
  httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch']);
  taskService = new TaskService(httpClientSpy as any);
});

it('should return expected guest tasks (HttpClient called once)', () => {
  const taskId = 1;
  const expectedTasks: TaskModel[] =
    [new TaskModel({ id: 1, title: 'A' }), new TaskModel({ id: 2, title: 'B' })];

  httpClientSpy.get.and.returnValue(of(expectedTasks));

  taskService.getByRoom(1).subscribe(
    tasks => expect(tasks).toEqual(expectedTasks));

  expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
});

it('should return an error when the server returns a 404', () => {
  const errorResponse = new HttpErrorResponse({
    error: 'test 404 error',
    status: 404, statusText: 'Not Found'
  });

  httpClientSpy.get.and.returnValue(throwError(errorResponse));

  taskService.getByRoom(1).subscribe(
    _ => fail('expected an error, not tasks'),
    error  => expect(error.error).toContain('test 404 error')
  );
});

it('should patch to the server (HttpClient called once)', () => {
  const task: TaskModel = new TaskModel({ id: 1, title: 'A' });

  httpClientSpy.patch.and.returnValue(of(1));

  taskService.updateTask(task).subscribe(_ => _);

  expect(httpClientSpy.patch.calls.count()).toBe(1, 'one call');
});

it('should create and estimation ', () => {
  const estimationId = 1;
  const estimation: EstimationModel = { name: 'A', guestUserId: 1, taskId: 1 };

  httpClientSpy.post.and.returnValue(of(estimationId));

  taskService.estimate(estimation).subscribe(returnedEstimationId => expect(returnedEstimationId).toEqual(estimationId));

  expect(httpClientSpy.post.calls.count()).toBe(1, 'one call');
});
