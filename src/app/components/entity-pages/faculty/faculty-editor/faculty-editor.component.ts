import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {Faculty} from '../../../../models/entities/faculty';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-faculty-editor',
  templateUrl: './faculty-editor.component.html',
  styleUrls: ['./faculty-editor.component.less']
})
export class FacultyEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<FacultyEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private facultyRest: FacultyRestService,
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
      this.facultyRest.update(this.data.entity).subscribe(
        (faculty: Faculty) => {
          if (faculty) {
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
      this.facultyRest.create(this.data.entity).subscribe(
        (faculty: Faculty) => {
          if (faculty) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Faculty has ID = ' + faculty.id);
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
