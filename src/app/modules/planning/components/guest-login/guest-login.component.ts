import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GuestUserService} from '../../../../services/guest-user.service';
import {GuestUserModel} from '../../../../models/GuestUser.model';

@Component({
  selector: 'app-guest-login',
  templateUrl: './guest-login.component.html',
  styleUrls: ['./guest-login.component.scss']
})
export class GuestLoginComponent implements OnInit {

  guestForm: FormGroup;
  @Input() roomId: number;
  @Output() loggedInEvent = new EventEmitter<GuestUserModel>();

  constructor(
    private formBuilder: FormBuilder,
    private guestUserService: GuestUserService,
  ) { }

  ngOnInit(): void {
    this.guestForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      spectator: [null, []]
    });
  }

  submit(): void {
    if (!this.guestForm.valid) {
      return;
    }
    const formValue = this.guestForm.value;
    const guestUser: GuestUserModel = { roomId: this.roomId, name: formValue.name, spectator: formValue.spectator };
    this.guestUserService.create(guestUser).subscribe(_ => this.loggedInEvent.emit(guestUser)
      , error => console.error(error));
  }

}
