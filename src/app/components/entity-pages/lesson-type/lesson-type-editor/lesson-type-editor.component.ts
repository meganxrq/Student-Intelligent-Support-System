import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LessonTypeRestService} from '../../../../services/rest-services/entities/lesson-type-rest.service';
import {Type} from '../../../../models/entities/type';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-lesson-type-editor',
  templateUrl: './lesson-type-editor.component.html',
  styleUrls: ['./lesson-type-editor.component.less']
})
export class LessonTypeEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<LessonTypeEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private lessonTypeRest: LessonTypeRestService,
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
      this.lessonTypeRest.update(this.data.entity).subscribe(
        (lessonType: Type) => {
          if (lessonType) {
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
      this.lessonTypeRest.create(this.data.entity).subscribe(
        (lessonType: Type) => {
          if (lessonType) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Type has ID = ' + lessonType.id);
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
