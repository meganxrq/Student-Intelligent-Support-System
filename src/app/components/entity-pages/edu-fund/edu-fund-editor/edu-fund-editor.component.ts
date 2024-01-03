import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EduFundRestService} from '../../../../services/rest-services/entities/edu-fund-rest.service';
import {EduFund} from '../../../../models/entities/edu-fund';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-edu-fund-editor',
  templateUrl: './edu-fund-editor.component.html',
  styleUrls: ['./edu-fund-editor.component.less']
})
export class EduFundEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<EduFundEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private eduFundRest: EduFundRestService,
    private notification: SnackBarService
  ) {
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        name: ''
      };
    }
  }

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.name = this.data.entity.name.trim().replace(/\s\s+/g, ' ');

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.eduFundRest.update(this.data.entity).subscribe(
        (eduFund: EduFund) => {
          if (eduFund) {
            this.dialogRef.close({refresh: true});
            this.notify(ServerResponse.SUCCESS);
          } else {
            this.notify(ServerResponse.NO_SUCH_RECORD);
          }
        },
        error => {
          this.notify(ServerResponse.NO_RESPONSE);
        }
      );
    } else if (this.data.editorMode.toLowerCase() === 'create') {
      this.eduFundRest.create(this.data.entity).subscribe(
        (eduFund: EduFund) => {
          if (eduFund) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New EduFund has ID = ' + eduFund.id);
          } else {
            this.notify(ServerResponse.RECORD_ALREADY_EXISTS);
          }
        },
        error => {
          this.notify(ServerResponse.NO_RESPONSE);
        }
      );
    }
  }

  disableSaveBtn(): boolean {
    return this.isSaveBtnDisabled ||
      this.data.entity.name.trim() === '';
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
