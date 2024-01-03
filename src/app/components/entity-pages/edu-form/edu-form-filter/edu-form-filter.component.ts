import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';


@Component({
  selector: 'app-edu-form-filter',
  templateUrl: './edu-form-filter.component.html',
  styleUrls: ['./edu-form-filter.component.less']
})
export class EduFormFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<EduFormFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter
  ) {
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.filter);
  }

  disableSaveBtn(): boolean {
    return false/*this.isSaveBtnDisabled ||
      this.filter.name.trim() === ''*/;
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
