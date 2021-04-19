import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {map, retry, share, switchMap, take} from 'rxjs/operators';
import {EstimationModel, TaskModel} from '../models/Task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseURL = 'http://localhost:8080/api/v1/tasks/';

  constructor(private http: HttpClient) {}

  getByRoom(roomId: number): Observable<TaskModel[]> {
    return timer(1, 1500).pipe(
      switchMap(() => this.http.get<TaskModel[]>(`${this.baseURL}?roomId=${roomId}`)
                                      .pipe(
                                        take(1),
                                        map(tasks => tasks.map(task => new TaskModel(task)))
                                      )
      ),
      retry(),
      share()
    );
  }

  estimate(estimation: EstimationModel): Observable<number> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(estimation);
    return this.http.post<number>(`${this.baseURL}/estimations`, body, { headers })
      .pipe(take(1));
  }
}
