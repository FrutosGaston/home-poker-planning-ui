import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-planning-home',
  templateUrl: './planning-home.component.html',
  styleUrls: ['./planning-home.component.scss']
})
export class PlanningHomeComponent implements OnInit {

  showCreateRoomForm = false;

  constructor() { }

  ngOnInit(): void {}

  toggleCreateRoomForm(): void {
    this.showCreateRoomForm = !this.showCreateRoomForm;
  }
}
