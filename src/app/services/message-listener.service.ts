import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {TaskModel} from '../models/Task.model';
import {Message} from '@stomp/stompjs';
import {RxStompService} from '@stomp/ng2-stompjs';
import {CaseConverter} from '../util/case-converter';
import {EstimationModel} from '../models/Estimation.model';

@Injectable({
  providedIn: 'root'
})
export class MessageListenerService {

  constructor(private rxStompService: RxStompService) {}

  listen<T>(path: string): Observable<T> {
    return this.rxStompService.watch(path).pipe(
      map((message: Message) => CaseConverter.keysToCamel(JSON.parse(message.body)))
    );
  }
}
