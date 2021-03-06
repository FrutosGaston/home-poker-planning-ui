import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {TaskModel} from '../models/Task.model';
import {EstimationModel} from '../models/Estimation.model';
import {MessageListenerService} from './message-listener.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  baseURL = `${environment.apiUrl}/api/v1/tasks`;

  constructor(private http: HttpClient, private messageListenerService: MessageListenerService) {}

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

  invalidateEstimations(taskId: number): Observable<number> {
    const headers = { 'content-type': 'application/json'};
    return this.http.delete<number>(`${this.baseURL}/${taskId}/estimations`, { headers })
      .pipe(take(1));
  }

  estimateFinal(estimation: EstimationModel): Observable<number> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(estimation);
    return this.http.post<number>(`${this.baseURL}/final-estimations`, body, { headers })
      .pipe(take(1));
  }

  create(task: TaskModel): Observable<number> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(task);
    return this.http.post<number>(this.baseURL, body, { headers })
      .pipe(take(1));
  }

  updateTask(task: TaskModel): Observable<any> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(task);
    return this.http.patch<number>(`${this.baseURL}/${task.id}`, body, { headers })
      .pipe(take(1));
  }

  onNewEstimation(roomId: number): Observable<EstimationModel> {
    return this.messageListenerService.listen(`/room/${roomId}/estimations/created`);
  }

  onTaskEstimated(roomId: number): Observable<TaskModel> {
    return this.messageListenerService.listen(`/room/${roomId}/tasks/estimated`).pipe(
      map((task: TaskModel) => new TaskModel(task))
    );
  }

  onNewTask(roomId: number): Observable<TaskModel> {
    return this.messageListenerService.listen(`/room/${roomId}/tasks/created`).pipe(
      map((task: TaskModel) => new TaskModel(task))
    );
  }

  onEstimationsInvalidated(roomId: number): Observable<TaskModel> {
    return this.messageListenerService.listen(`/room/${roomId}/tasks/estimations/invalidatedAll`).pipe(
      map((task: TaskModel) => new TaskModel(task))
    );
  }
}
