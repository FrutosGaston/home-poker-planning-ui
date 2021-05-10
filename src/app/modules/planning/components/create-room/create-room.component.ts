import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RoomService} from '../../../../services/room.service';
import {GuestUserService} from '../../../../services/guest-user.service';
import {RoomModel} from '../../../../models/Room.model';
import {GuestUserModel} from '../../../../models/GuestUser.model';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  roomForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private guestUserService: GuestUserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      description: [null, [Validators.maxLength(255)]]
    });
  }

  submit(): void {
    if (!this.roomForm.valid) {
      return;
    }
    const formValues = this.roomForm.value;
    this.roomService.create({ title: formValues.title, description: formValues.description } as RoomModel).subscribe(roomId => {
        this.guestUserService.create({ name: formValues.name, roomId } as GuestUserModel)
          .subscribe(res => this.router.navigateByUrl('/room'));
      }
      , error => console.error(error));
  }

}
