import { Component, OnInit } from '@angular/core';
import {GuestUserService} from '../../../../services/guest-user.service';
import {GuestUserModel} from '../../../../models/GuestUser.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  loggedUser: GuestUserModel;
  usersInRoom: GuestUserModel[];
  estimationForm: FormGroup;

  constructor(private guestUserService: GuestUserService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loggedUser = this.guestUserService.loggedGuestUser || this.fakeUser();
    if (!this.loggedUser) { return; }
    this.guestUserService.findByRoom(this.loggedUser.roomId).subscribe(guestUserList => this.usersInRoom = guestUserList);

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
}
