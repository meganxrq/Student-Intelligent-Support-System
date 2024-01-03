import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';


@Component({
  selector: 'app-scholarship-filter',
  templateUrl: './scholarship-filter.component.html',
  styleUrls: ['./scholarship-filter.component.less']
})
export class ScholarshipFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<ScholarshipFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter
  ) {
  }

  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.filter);
  }

  disableSaveBtn(): boolean {
    return this.filter.amount !== ''
      && isNaN(parseFloat(this.filter.amount));
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
