import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, timer} from 'rxjs';
import {map, retry, share, switchMap, take} from 'rxjs/operators';
import {RoundModel} from '../models/Round.model';

@Injectable({
  providedIn: 'root'
})
export class RoundService {

  baseURL = 'http://localhost:8080/api/v1/rounds/';

  constructor(private http: HttpClient) {}

  getByRoom(roomId: number): Observable<RoundModel> {
    return timer(1, 3000).pipe(
      switchMap(() => this.http.get<RoundModel>(`${this.baseURL}?roomId=${roomId}`)
                                      .pipe(take(1), map(round => new RoundModel(round)))),
      retry(),
      share()
    );
  }
}
