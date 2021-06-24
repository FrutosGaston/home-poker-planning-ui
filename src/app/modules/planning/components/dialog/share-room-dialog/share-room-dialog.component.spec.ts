import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRoomDialogComponent } from './share-room-dialog.component';

describe('ShareRoomDialogComponent', () => {
  let component: ShareRoomDialogComponent;
  let fixture: ComponentFixture<ShareRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareRoomDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
