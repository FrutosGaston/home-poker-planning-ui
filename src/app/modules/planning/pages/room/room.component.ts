import { Component, OnInit } from '@angular/core';
import {GuestUserService} from '../../../../services/guest-user.service';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoundService} from '../../../../services/round.service';
import {EstimationModel, RoundModel} from '../../../../models/Round.model';
import {combineLatest} from 'rxjs';

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
    this.loggedUser = this.guestUserService.loggedGuestUser; // || this.fakeUser();
    if (!this.loggedUser) { return; }
    const currentRoom = this.loggedUser.roomId;

    const users$ = this.guestUserService.findByRoom(currentRoom);
    const round$ = this.roundService.getByRoom(currentRoom);

    combineLatest([users$, round$]).subscribe(results => {
      this.usersInRoom = results[0];
      this.round = results[1];
      this.roundDone = this.round.done(this.usersInRoom);
    });

    this.estimationForm = this.formBuilder.group({
      points: [null, [Validators.required]],
    });
  }

  estimate(): void {
    if (!this.estimationForm.valid) {
      return;
    }
    const estimation = new EstimationModel();
    estimation.guestUserId = this.loggedUser.id;
    estimation.roundId = this.round.id;
    estimation.name = this.estimationForm.value.points;
    this.roundService.estimate(estimation).subscribe(_ => {});
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
