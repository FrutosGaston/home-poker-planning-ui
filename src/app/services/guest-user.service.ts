import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {GuestUserModel} from '../models/GuestUser.model';
import {map, take, tap} from 'rxjs/operators';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {CaseConverter} from '../util/case-converter';
import {EstimationModel} from '../models/Task.model';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  baseURL = 'http://localhost:8080/api/v1/guest-users/';
  // tslint:disable-next-line:variable-name
  private _loggedGuestUser: GuestUserModel;

  constructor(private http: HttpClient, private rxStompService: RxStompService) {}

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

  onNewGuestUser(roomId: number): Observable<GuestUserModel> {
    return this.rxStompService.watch(`/room/${roomId}/guest-users/created`).pipe(
      map((message: Message) => {
        const jsonBody = message.body;
        return CaseConverter.keysToCamel(JSON.parse(jsonBody)) as GuestUserModel;
      })
    );
  }

  get loggedGuestUser(): GuestUserModel {
    return this._loggedGuestUser;
  }

}
