import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GuestUserService} from '../../../../services/guest-user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-guest-login',
  templateUrl: './guest-login.component.html',
  styleUrls: ['./guest-login.component.scss']
})
export class GuestLoginComponent implements OnInit {

  guestForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: GuestUserService,
    private router: Router
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
    this.roomService.create(this.guestForm.value).subscribe(res => this.router.navigateByUrl('/room')
      , error => console.error(error));
  }

}
