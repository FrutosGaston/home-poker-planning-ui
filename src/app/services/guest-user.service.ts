import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {GuestUserModel} from '../models/GuestUser.model';
import {take, tap} from 'rxjs/operators';
import {CompatClient, Stomp, StompSubscription} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  baseURL = 'http://localhost:8080/api/v1/guest-users/';
  // tslint:disable-next-line:variable-name
  private _loggedGuestUser: GuestUserModel;
  private stompClient: CompatClient;

  constructor(private http: HttpClient) {}

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
    const socket = new SockJS('http://localhost:8080/');
    this.stompClient = Stomp.over(socket);
    const self = this;

    this.stompClient.connect({}, _ => {
      self.stompClient.subscribe(`/room/${roomId}/guest-users/created`, meesage => {
        handler(JSON.parse(meesage.body));
      });
    });
  }

  get loggedGuestUser(): GuestUserModel {
    return this._loggedGuestUser;
  }

}
