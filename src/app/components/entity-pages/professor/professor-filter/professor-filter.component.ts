import {Component, Inject, OnInit} from '@angular/core';
import {Faculty} from '../../../../models/entities/faculty';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse, SEX} from '../../../../constants/const';
import {Department} from '../../../../models/entities/department';
import {ProfessorDegree} from '../../../../models/entities/professor-degree';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {ProfessorDegreeRestService} from '../../../../services/rest-services/entities/professor-degree-rest.service';

@Component({
  selector: 'app-professor-filter',
  templateUrl: './professor-filter.component.html',
  styleUrls: ['./professor-filter.component.less']
})
export class ProfessorFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private sexList = SEX;
  private faculty: Faculty;
  private facultyList: Faculty[];
  private departmentList: Department[];
  private degreeList: ProfessorDegree[];

  constructor(
    private dialogRef: MatDialogRef<ProfessorFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private degreeRest: ProfessorDegreeRestService,
    private notification: SnackBarService
  ) {
    if (this.filter.department) {
      this.faculty = this.filter.department.faculty;
      this.getDepartmentList();
    }
    this.getFacultyList();
    this.getDegreeList();
  }

  ngOnInit() {
  }

  getFacultyList() {
    this.facultyRest.getAll().subscribe(
      (facultyList: Faculty[]) => {
        this.facultyList = facultyList;
        if (this.faculty) {
          for (const faculty of this.facultyList) {
            if (faculty.shortName === this.faculty.shortName) {
              this.faculty = faculty;
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

  getDepartmentList() {
    this.departmentRest.getAll(this.faculty.shortName).subscribe(
      (departmentList: Department[]) => {
        this.departmentList = departmentList;
        if (this.filter.department) {
          for (const department of this.departmentList) {
            if (department.name === this.filter.department.name) {
              this.filter.department = department;
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

  getDegreeList() {
    this.degreeRest.getAll().subscribe(
      (degreeList: ProfessorDegree[]) => {
        this.degreeList = degreeList;
        if (this.filter.degree) {
          for (const degree of this.degreeList) {
            if (degree.name === this.filter.degree.name) {
              this.filter.degree = degree;
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
    return this.faculty && !this.filter.department;
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
