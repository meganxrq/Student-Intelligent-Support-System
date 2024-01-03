import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {Faculty} from '../../../../models/entities/faculty';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {ServerResponse} from '../../../../constants/const';
import {SnackBarService} from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-department-filter',
  templateUrl: './department-filter.component.html',
  styleUrls: ['./department-filter.component.less']
})
export class DepartmentFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyList: Faculty[];

  constructor(
    private dialogRef: MatDialogRef<DepartmentFilterComponent>,
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
