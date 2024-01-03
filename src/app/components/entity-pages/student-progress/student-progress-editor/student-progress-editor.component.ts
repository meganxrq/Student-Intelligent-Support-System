import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StudentProgressRestService} from '../../../../services/rest-services/entities/student-progress-rest.service';
import {StudentProgress} from '../../../../models/entities/student-progress';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-student-progress-editor',
  templateUrl: './student-progress-editor.component.html',
  styleUrls: ['./student-progress-editor.component.less']
})
export class StudentProgressEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<StudentProgressEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private studentProgressRest: StudentProgressRestService,
    private notification: SnackBarService
  ) {
  }

  ngOnInit() {
  }

  save() {
    this.isSaveBtnDisabled = true;

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.studentProgressRest.update(this.data.entity).subscribe(
        (studentProgress: StudentProgress) => {
          if (studentProgress) {
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
    }/* else if (this.data.editorMode.toLowerCase() === 'create') {
      this.studentProgressRest.create(this.data.entity).subscribe(
        (studentProgress: StudentProgress) => {
          if (studentProgress) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New StudentProgress has ID = ' + studentProgress.id);
          } else {
            this.notify(ServerResponse.RECORD_ALREADY_EXISTS);
          }
        },
        error => {
          this.notify(ServerResponse.NO_RESPONSE);
        }
      );
    }*/
  }

  disableSaveBtn(): boolean {
    return false;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
