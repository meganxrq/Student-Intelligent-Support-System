import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';


@Component({
  selector: 'app-traineeship-type-filter',
  templateUrl: './traineeship-type-filter.component.html',
  styleUrls: ['./traineeship-type-filter.component.less']
})
export class TraineeshipTypeFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<TraineeshipTypeFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter
  ) {
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.filter);
  }

  disableSaveBtn(): boolean {
    return false;
  }

  getArrowLabel(): string {
    if (this.filter.isAscending) {
      return '↑';
    } else {
      return '↓';
    }
  }

  switchOrderMode() {
    this.filter.isAscending = !this.filter.isAscending;
  }

}
