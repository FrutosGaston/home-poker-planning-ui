import {Injectable} from '@angular/core';
import {CompatClient, Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private baseURL = 'http://localhost:8080/';
  private stompClient: CompatClient;

  subscribe(path: string, handler: (_) => any): void {
    if (this.stompClient && this.stompClient.connected && !this.stompClient.active) {
      this.subscribeOnConnection(path, handler);
    } else if (this.stompClient && this.stompClient.connected && this.stompClient.active) {
      this.subscribeFinal(path, handler);
    } else {
      this.subscribeDisconnected(path, handler);
    }
  }

  private subscribeOnConnection(path: string, handler: (_) => any): void {
    console.log('subscribeOnConnection: {}', path);

    this.stompClient.onConnect({}, _ => {
      this.subscribeFinal(path, handler);
    });
  }

  private subscribeDisconnected(path: string, handler: (_) => any): void {
    console.log('subscribeDisconnected: {}', path);

    const socket = new SockJS(this.baseURL);
    this.stompClient = Stomp.over(socket);
    this.subscribeOnConnection(path, handler);
  }

  private subscribeFinal(path: string, handler: (_) => any): any {
    console.log('subscribeFinal: {}', path);

    this.stompClient.subscribe(path, meesage => {
      handler(this.keysToCamel(JSON.parse(meesage.body)));
    });
  }

  private toCamel(s: string): string {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  private keysToCamel(o: any): any {
    if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
      const n = {};
      Object.keys(o)
        .forEach((k) => {
          n[this.toCamel(k)] = this.keysToCamel(o[k]);
        });
      return n;
    } else if (Array.isArray(o)) {
      return o.map((i) => {
        return this.keysToCamel(i);
      });
    }
    return o;
  }
}
