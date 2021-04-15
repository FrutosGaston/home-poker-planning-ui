import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-planning-home',
  templateUrl: './planning-home.component.html',
  styleUrls: ['./planning-home.component.scss']
})
export class PlanningHomeComponent implements OnInit {

  guestForm: FormGroup;

  constructor() { }

  ngOnInit(): void {}

}
