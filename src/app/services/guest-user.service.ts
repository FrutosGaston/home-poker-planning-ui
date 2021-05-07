import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {GuestUserModel} from '../models/GuestUser.model';
import {take, tap} from 'rxjs/operators';
import {WebsocketService} from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  baseURL = 'http://localhost:8080/api/v1/guest-users/';
  // tslint:disable-next-line:variable-name
  private _loggedGuestUser: GuestUserModel;

  constructor(private http: HttpClient, private websocketService: WebsocketService) {}

  create(guestUser: GuestUserModel): Observable<number> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(guestUser);

    return this.http.post<number>(`${this.baseURL}`, body, { headers })
      .pipe(take(1), tap(id => {
        guestUser.id = id;
        this._loggedGuestUser = guestUser;
      }));
  }

  findByRoom(roomId: number): Observable<GuestUserModel[]> {
    return this.http.get<GuestUserModel[]>(`${this.baseURL}?roomId=${roomId}`)
      .pipe(take(1));
  }

  onNewGuestUser(roomId: number, handler: (GuestUserModel) => any): void {
    this.websocketService.subscribe(`/room/${roomId}/guest-users/created`, handler);
  }

  get loggedGuestUser(): GuestUserModel {
    return this._loggedGuestUser;
  }

}
