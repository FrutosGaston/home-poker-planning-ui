import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../../../../environments/environment';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';

interface ShareRoomDialogData {
  roomUUID: string;
}

@Component({
  selector: 'app-share-room-dialog',
  templateUrl: './share-room-dialog.component.html',
  styleUrls: ['./share-room-dialog.component.scss']
})
export class ShareRoomDialogComponent implements OnInit {
  roomUrl: string;

  constructor(private snackBar: MatSnackBar,
              private translateService: TranslateService,
              @Inject(MAT_DIALOG_DATA) public data: ShareRoomDialogData) { }

  ngOnInit(): void {
    this.roomUrl = environment.shareRoomUrl + this.data.roomUUID;
  }

  copyInputMessage(inputElement): void {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.snackBar.open(this.translateService.instant('planning.room.share.copied') + ' ✅', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['ok-snackbar']
    });
  }

}
