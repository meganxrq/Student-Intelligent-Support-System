import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProfessorDegreeRestService} from '../../../../services/rest-services/entities/professor-degree-rest.service';
import {ProfessorDegree} from '../../../../models/entities/professor-degree';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-professor-degree-editor',
  templateUrl: './professor-degree-editor.component.html',
  styleUrls: ['./professor-degree-editor.component.less']
})
export class ProfessorDegreeEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<ProfessorDegreeEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private professorDegreeRest: ProfessorDegreeRestService,
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
      this.professorDegreeRest.update(this.data.entity).subscribe(
        (professorDegree: ProfessorDegree) => {
          if (professorDegree) {
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
      this.professorDegreeRest.create(this.data.entity).subscribe(
        (professorDegree: ProfessorDegree) => {
          if (professorDegree) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New ProfessorDegree has ID = ' + professorDegree.id);
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
