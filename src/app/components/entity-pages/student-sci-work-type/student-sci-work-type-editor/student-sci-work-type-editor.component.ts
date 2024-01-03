import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StudentSciWorkTypeRestService} from '../../../../services/rest-services/entities/student-sci-work-type-rest.service';
import {Type} from '../../../../models/entities/type';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-student-sci-work-type-editor',
  templateUrl: './student-sci-work-type-editor.component.html',
  styleUrls: ['./student-sci-work-type-editor.component.less']
})
export class StudentSciWorkTypeEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<StudentSciWorkTypeEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private studentSciWorkTypeRest: StudentSciWorkTypeRestService,
    private notification: SnackBarService
  ) {
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        type: ''
      };
    }
  }

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.type = this.data.entity.type.trim().replace(/\s\s+/g, ' ');

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.studentSciWorkTypeRest.update(this.data.entity).subscribe(
        (studentSciWorkType: Type) => {
          if (studentSciWorkType) {
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
      this.studentSciWorkTypeRest.create(this.data.entity).subscribe(
        (studentSciWorkType: Type) => {
          if (studentSciWorkType) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Type has ID = ' + studentSciWorkType.id);
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
      this.data.entity.type.trim() === '';
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
