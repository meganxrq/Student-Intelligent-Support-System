import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TraineeshipTypeRestService} from '../../../../services/rest-services/entities/traineeship-type-rest.service';
import {Type} from '../../../../models/entities/type';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-traineeship-type-editor',
  templateUrl: './traineeship-type-editor.component.html',
  styleUrls: ['./traineeship-type-editor.component.less']
})
export class TraineeshipTypeEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<TraineeshipTypeEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private traineeshipTypeRest: TraineeshipTypeRestService,
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
      this.traineeshipTypeRest.update(this.data.entity).subscribe(
        (traineeshipType: Type) => {
          if (traineeshipType) {
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
      this.traineeshipTypeRest.create(this.data.entity).subscribe(
        (traineeshipType: Type) => {
          if (traineeshipType) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Type has ID = ' + traineeshipType.id);
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
