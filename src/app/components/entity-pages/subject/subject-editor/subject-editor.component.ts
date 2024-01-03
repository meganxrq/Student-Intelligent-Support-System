import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SubjectRestService} from '../../../../services/rest-services/entities/subject-rest.service';
import {Subject} from '../../../../models/entities/subject';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-subject-editor',
  templateUrl: './subject-editor.component.html',
  styleUrls: ['./subject-editor.component.less']
})
export class SubjectEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<SubjectEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private subjectRest: SubjectRestService,
    private notification: SnackBarService
  ) {
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        shortName: '',
        fullName: ''
      };
    }
  }

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.shortName = this.data.entity.shortName.trim().replace(/\s\s+/g, ' ');
    this.data.entity.fullName = this.data.entity.fullName.trim().replace(/\s\s+/g, ' ');

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.subjectRest.update(this.data.entity).subscribe(
        (subject: Subject) => {
          if (subject) {
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
      this.subjectRest.create(this.data.entity).subscribe(
        (subject: Subject) => {
          if (subject) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Subject has ID = ' + subject.id);
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
      this.data.entity.fullName.trim() === '' ||
      this.data.entity.shortName.trim() === '';
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
