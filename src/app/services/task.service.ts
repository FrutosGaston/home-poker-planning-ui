import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {EstimationModel, TaskModel} from '../models/Task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseURL = 'http://localhost:8080/api/v1/tasks';

  constructor(private http: HttpClient) {}

  getByRoom(roomId: number): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(`${this.baseURL}?roomId=${roomId}`)
                                      .pipe(
                                        take(1),
                                        map(tasks => tasks.map(task => new TaskModel(task)))
                                      );
  }

  estimate(estimation: EstimationModel): Observable<number> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(estimation);
    return this.http.post<number>(`${this.baseURL}/estimations`, body, { headers })
      .pipe(take(1));
  }

  updateTask(task: TaskModel): Observable<any> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(task);
    return this.http.patch<number>(`${this.baseURL}/${task.id}`, body, { headers })
      .pipe(take(1));
  }
}
