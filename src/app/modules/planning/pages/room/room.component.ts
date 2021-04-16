import { Component, OnInit } from '@angular/core';
import {GuestUserService} from '../../../../services/guest-user.service';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoundService} from '../../../../services/round.service';
import {EstimationModel, RoundModel} from '../../../../models/Round.model';
import {combineLatest, forkJoin, zip} from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  loggedUser: GuestUserModel;
  usersInRoom: GuestUserModel[];
  estimationForm: FormGroup;
  round: RoundModel;
  roundDone = false;

  constructor(private guestUserService: GuestUserService,
              private roundService: RoundService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loggedUser = this.guestUserService.loggedGuestUser || this.fakeUser();
    if (!this.loggedUser) { return; }
    const currentRoom = this.loggedUser.roomId;

    const users$ = this.guestUserService.findByRoom(currentRoom);
    users$.subscribe(guestUserList => this.usersInRoom = guestUserList);
    const round$ = this.roundService.getByRoom(currentRoom);
    round$.subscribe(round => this.round = round);

    combineLatest([users$, round$]).subscribe(results => {
      const round: RoundModel = results[1];
      this.roundDone = round.done(results[0]);
    });

    this.estimationForm = this.formBuilder.group({
      points: [null, [Validators.required]],
    });
  }

  estimate(): void {
    if (!this.estimationForm.valid) {
      return;
    }
    console.log(this.estimationForm.value.points);
  }

  private fakeUser(): GuestUserModel {
    const fakeUser = new GuestUserModel();
    fakeUser.roomId = 1;
    fakeUser.name = 'Gaston';
    fakeUser.id = 4;
    return fakeUser;
  }

  getEstimation(id: number): EstimationModel {
    return this.round.estimations.find(estimation => estimation.guestUserId === id);
  }
}
