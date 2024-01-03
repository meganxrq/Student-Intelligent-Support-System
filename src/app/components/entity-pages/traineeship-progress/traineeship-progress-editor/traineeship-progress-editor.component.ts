import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {TraineeshipProgressRestService} from '../../../../services/rest-services/entities/traineeship-progress-rest.service';
import {TraineeshipProgress} from '../../../../models/entities/traineeship-progress';

@Component({
  selector: 'app-traineeship-progress-editor',
  templateUrl: './traineeship-progress-editor.component.html',
  styleUrls: ['./traineeship-progress-editor.component.less']
})
export class TraineeshipProgressEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<TraineeshipProgressEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private traineeshipProgressRest: TraineeshipProgressRestService,
    private notification: SnackBarService
  ) {
  }

  ngOnInit() {
  }

  save() {
    this.isSaveBtnDisabled = true;

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.traineeshipProgressRest.update(this.data.entity).subscribe(
        (traineeshipProgress: TraineeshipProgress) => {
          if (traineeshipProgress) {
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
      this.traineeshipProgressRest.create(this.data.entity).subscribe(
        (traineeshipProgress: TraineeshipProgress) => {
          if (traineeshipProgress) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New TraineeshipProgress has ID = ' + traineeshipProgress.id);
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
