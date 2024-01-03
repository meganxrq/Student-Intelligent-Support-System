import {Component, Inject, OnInit} from '@angular/core';
import {PROGRAM_LIST, ServerResponse, SEX} from '../../../../constants/const';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {EduFund} from '../../../../models/entities/edu-fund';
import {Scholarship} from '../../../../models/entities/scholarship';
import {Faculty} from '../../../../models/entities/faculty';
import {EduFundRestService} from '../../../../services/rest-services/entities/edu-fund-rest.service';
import {ScholarshipRestService} from '../../../../services/rest-services/entities/scholarship-rest.service';
import {SnackBarService} from '../../../../services/snack-bar.service';

@Component({
  selector: 'app-student-filter',
  templateUrl: './student-filter.component.html',
  styleUrls: ['./student-filter.component.less']
})
export class StudentFilterComponent implements OnInit {

  private sexList = SEX;
  private programList = PROGRAM_LIST;
  private facultyList: Faculty[];
  private eduFundList: EduFund[];
  private scholarshipList: Scholarship[];

  constructor(
    private dialogRef: MatDialogRef<StudentFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private facultyRest: FacultyRestService,
    private eduFundRest: EduFundRestService,
    private scholarshipRest: ScholarshipRestService,
    private notification: SnackBarService
  ) {
    this.getFacultyList();
    this.getEduFundList();
    this.getScholarshipList();
  }

  ngOnInit() {
  }

  getFacultyList() {
    this.facultyRest.getAll().subscribe(
      (facultyList: Faculty[]) => {
        this.facultyList = facultyList;
        if (this.filter.faculty) {
          for (const faculty of this.facultyList) {
            if (faculty.id === this.filter.faculty.id) {
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

  getEduFundList() {
    this.eduFundRest.getAll().subscribe(
      (eduFundList: EduFund[]) => {
        this.eduFundList = eduFundList;
        if (this.filter.eduFund) {
          for (const eduFund of this.eduFundList) {
            if (eduFund.id === this.filter.eduFund.id) {
              this.filter.eduFund = eduFund;
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

  getScholarshipList() {
    this.scholarshipRest.getAll().subscribe(
      (scholarshipList: Scholarship[]) => {
        this.scholarshipList = scholarshipList;
        if (this.filter.scholarship) {
          for (const scholarship of this.scholarshipList) {
            if (scholarship.id === this.filter.scholarship.id) {
              this.filter.scholarship = scholarship;
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
