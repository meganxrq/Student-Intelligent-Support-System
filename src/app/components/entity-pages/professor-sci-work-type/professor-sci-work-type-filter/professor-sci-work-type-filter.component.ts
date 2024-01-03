import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';

@Component({
  selector: 'app-professor-sci-work-type-filter',
  templateUrl: './professor-sci-work-type-filter.component.html',
  styleUrls: ['./professor-sci-work-type-filter.component.less']
})
export class ProfessorSciWorkTypeFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;

  constructor(
    private dialogRef: MatDialogRef<ProfessorSciWorkTypeFilterComponent>,
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
