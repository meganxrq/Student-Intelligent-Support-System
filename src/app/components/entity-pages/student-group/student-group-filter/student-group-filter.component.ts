import {Component, Inject, OnInit} from '@angular/core';
import {Faculty} from '../../../../models/entities/faculty';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {PROGRAM_LIST, ServerResponse} from '../../../../constants/const';
import {EduForm} from '../../../../models/entities/edu-form';
import {EduFormRestService} from '../../../../services/rest-services/entities/edu-form-rest.service';

@Component({
  selector: 'app-student-group-filter',
  templateUrl: './student-group-filter.component.html',
  styleUrls: ['./student-group-filter.component.less']
})
export class StudentGroupFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyList: Faculty[];
  private programList = PROGRAM_LIST;
  private eduFormList: EduForm[];

  constructor(
    private dialogRef: MatDialogRef<StudentGroupFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private facultyRest: FacultyRestService,
    private eduFormRest: EduFormRestService,
    private notification: SnackBarService
  ) {
    this.getFacultyList();
    this.getEduFormList();
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

  getEduFormList() {
    this.eduFormRest.getAll().subscribe(
      (eduFormList: EduForm[]) => {
        this.eduFormList = eduFormList;
        if (this.filter.eduForm) {
          for (const eduForm of this.eduFormList) {
            if (eduForm.name === this.filter.eduForm.name) {
              this.filter.eduForm = eduForm;
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
