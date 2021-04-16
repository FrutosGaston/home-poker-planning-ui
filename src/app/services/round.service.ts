import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {map, retry, share, switchMap, take, tap} from 'rxjs/operators';
import {EstimationModel, RoundModel} from '../models/Round.model';
import {GuestUserModel} from '../models/GuestUser.model';

@Injectable({
  providedIn: 'root'
})
export class RoundService {

  baseURL = 'http://localhost:8080/api/v1/rounds/';

  constructor(private http: HttpClient) {}

  getByRoom(roomId: number): Observable<RoundModel> {
    return timer(1, 1500).pipe(
      switchMap(() => this.http.get<RoundModel>(`${this.baseURL}?roomId=${roomId}`)
                                      .pipe(take(1), map(round => new RoundModel(round)))),
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
