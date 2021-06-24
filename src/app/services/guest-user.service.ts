import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GuestUserModel} from '../models/GuestUser.model';
import {take, tap} from 'rxjs/operators';
import {MessageListenerService} from './message-listener.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  baseURL = `${environment.apiUrl}/api/v1/guest-users`;

  constructor(private http: HttpClient, private messageListenerService: MessageListenerService) {}

  create(guestUser: GuestUserModel): Observable<number> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(guestUser);

    return this.http.post<number>(`${this.baseURL}`, body, { headers })
      .pipe(take(1), tap(id => {
        guestUser.id = id;
        sessionStorage.setItem(`usr-${guestUser.roomId}`, JSON.stringify(guestUser));
      }));
  }

  findByRoom(roomId: number): Observable<GuestUserModel[]> {
    return this.http.get<GuestUserModel[]>(`${this.baseURL}?roomId=${roomId}`)
      .pipe(take(1));
  }

  onNewGuestUser(roomId: number): Observable<GuestUserModel> {
    return this.messageListenerService.listen(`/room/${roomId}/guest-users/created`);
  }

  loggedGuestUser(roomId: number): GuestUserModel {
    return JSON.parse(sessionStorage.getItem(`usr-${roomId}`));
  }

}
