import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {RoomModel} from '../models/Room.model';
import {MessageListenerService} from './message-listener.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  baseURL = `${environment.apiUrl}/api/v1/rooms`;

  constructor(private http: HttpClient, private messageListenerService: MessageListenerService) {}

  create(room: RoomModel): Observable<RoomModel> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(room);

    return this.http.post<RoomModel>(`${this.baseURL}`, body, { headers })
      .pipe(take(1));
  }

  getByUUID(uuid: string): Observable<RoomModel> {
    return this.http.get<RoomModel>(`${this.baseURL}/${uuid}`)
      .pipe(take(1));
  }

  update(roomId: number, room: { selectedTaskId: number }): Observable<any> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(room);

    return this.http.patch<number>(`${this.baseURL}/${roomId}`, body, { headers })
      .pipe(take(1));
  }

  onRoomUpdated(roomId: number): Observable<RoomModel> {
    return this.messageListenerService.listen(`/room/${roomId}/updated`);
  }
}
