import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ScholarshipRestService} from '../../../../services/rest-services/entities/scholarship-rest.service';
import {Scholarship} from '../../../../models/entities/scholarship';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-scholarship-editor',
  templateUrl: './scholarship-editor.component.html',
  styleUrls: ['./scholarship-editor.component.less']
})
export class ScholarshipEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<ScholarshipEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private scholarshipRest: ScholarshipRestService,
    private notification: SnackBarService
  ) {
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        type: '',
        amount: ''
      };
    }
  }

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.type = this.data.entity.type.trim().replace(/\s\s+/g, ' ');

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.scholarshipRest.update(this.data.entity).subscribe(
        (scholarship: Scholarship) => {
          if (scholarship) {
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
      this.scholarshipRest.create(this.data.entity).subscribe(
        (scholarship: Scholarship) => {
          if (scholarship) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Scholarship has ID = ' + scholarship.id);
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
      this.data.entity.type.trim() === '' ||
      !this.data.entity.amount;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
