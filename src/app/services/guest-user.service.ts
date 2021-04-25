import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {GuestUserModel} from '../models/GuestUser.model';
import {map, retry, share, switchMap, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuestUserService {

  baseURL = 'http://localhost:8080/api/v1/guest-users/';
  // tslint:disable-next-line:variable-name
  private _loggedGuestUser: GuestUserModel;

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
    return timer(1, 5000).pipe(
      switchMap(() => this.http.get<GuestUserModel[]>(`${this.baseURL}?roomId=${roomId}`)
        .pipe(take(1))),
      retry(),
      share()
    );
  }

  get loggedGuestUser(): GuestUserModel {
    return this._loggedGuestUser;
  }

}
