import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {RoomModel} from '../models/Room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  baseURL = 'http://localhost:8080/api/v1/rooms/';

  constructor(private http: HttpClient) {}

  create(room: RoomModel): Observable<number> {
    const headers = { 'content-type': 'application/json'};
    const body = JSON.stringify(room);

    return this.http.post<number>(`${this.baseURL}`, body, { headers })
      .pipe(take(1));
  }

  get(roomId: number): Observable<RoomModel> {
    return this.http.get<RoomModel>(`${this.baseURL}/${roomId}`)
      .pipe(take(1));
  }

}
