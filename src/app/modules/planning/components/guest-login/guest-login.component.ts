import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoomService} from '../../../../services/room.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-guest-login',
  templateUrl: './guest-login.component.html',
  styleUrls: ['./guest-login.component.scss']
})
export class GuestLoginComponent implements OnInit {

  guestForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    this.guestForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      roomId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  submit(): void {
    if (!this.guestForm.valid) {
      return;
    }
    this.roomService.addGuestUser(this.guestForm.value).subscribe(res => console.log(res), error => console.error(error));
  }

}
