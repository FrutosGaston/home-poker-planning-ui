import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RoomService} from '../../../../services/room.service';
import {GuestUserService} from '../../../../services/guest-user.service';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {DeckModel} from '../../../../models/Deck.model';
import {DeckService} from '../../../../services/deck.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  roomForm: FormGroup;
  decks: DeckModel[];
  selectedDeckId: number;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private deckService: DeckService,
    private guestUserService: GuestUserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.deckService.findDecks().subscribe(decks => this.decks = decks);
    this.roomForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      deck: [null, [Validators.required]],
      description: [null, [Validators.maxLength(255)]]
    });
  }

  submit(): void {
    if (!this.roomForm.valid) {
      return;
    }
    const formValues = this.roomForm.value;
    this.roomService.create({ title: formValues.title, description: formValues.description, deckId: formValues.deck }).subscribe(roomId => {
        this.guestUserService.create({ name: formValues.name, roomId } as GuestUserModel)
          .subscribe(res => this.router.navigateByUrl(`/room/${roomId}`));
      }
      , error => console.error(error));
  }

}
