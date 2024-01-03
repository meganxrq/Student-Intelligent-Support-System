import {Component, Inject, OnInit} from '@angular/core';
import {Faculty} from '../../../../models/entities/faculty';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {PROGRAM_LIST, ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-specialty-filter',
  templateUrl: './specialty-filter.component.html',
  styleUrls: ['./specialty-filter.component.less']
})
export class SpecialtyFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyList: Faculty[];
  private programList = PROGRAM_LIST;

  constructor(
    private dialogRef: MatDialogRef<SpecialtyFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private facultyRest: FacultyRestService,
    private notification: SnackBarService
  ) {
    this.getFacultyList();
  }

  ngOnInit() {
  }

  getFacultyList() {
    this.facultyRest.getAll().subscribe(
      (facultyList: Faculty[]) => {
        this.facultyList = facultyList;
        if (this.filter.faculty) {
          for (const faculty of this.facultyList) {
            if (faculty.shortName === this.filter.faculty.shortName) {
              this.filter.faculty = faculty;
            }
          }
        }
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
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
