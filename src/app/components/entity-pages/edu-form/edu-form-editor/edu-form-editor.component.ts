import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EduFormRestService} from '../../../../services/rest-services/entities/edu-form-rest.service';
import {EduForm} from '../../../../models/entities/edu-form';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-edu-form-editor',
  templateUrl: './edu-form-editor.component.html',
  styleUrls: ['./edu-form-editor.component.less']
})
export class EduFormEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<EduFormEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private eduFormRest: EduFormRestService,
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
      this.eduFormRest.update(this.data.entity).subscribe(
        (eduForm: EduForm) => {
          if (eduForm) {
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
      this.eduFormRest.create(this.data.entity).subscribe(
        (eduForm: EduForm) => {
          if (eduForm) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New EduForm has ID = ' + eduForm.id);
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
