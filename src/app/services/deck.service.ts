import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {DeckModel} from '../models/Deck.model';



@Injectable({
  providedIn: 'root'
})
export class DeckService {

  baseURL = 'http://localhost:8080/api/v1/decks';
  private decks: DeckModel[];

  constructor(private http: HttpClient) {}

  findDecks(): Observable<DeckModel[]> {
    return this.decks ? of(this.decks) : this.http.get<DeckModel[]>(`${this.baseURL}`).pipe(
      take(1),
      map(decks => decks.map(deck => new DeckModel(deck))),
      tap(decks => this.decks = decks)
    );
  }
}
