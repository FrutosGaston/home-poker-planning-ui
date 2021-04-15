import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GuestUserModel} from '../models/GuestUser.model';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  baseURL = 'http://localhost:8080/api/v1/rooms/';

  constructor(private http: HttpClient) {}

  addGuestUser(guestUser: GuestUserModel): Observable<any> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(guestUser);

    return this.http.post(`${this.baseURL}${guestUser.roomId}/users`, body, { headers }).pipe(take(1));
  }
}
