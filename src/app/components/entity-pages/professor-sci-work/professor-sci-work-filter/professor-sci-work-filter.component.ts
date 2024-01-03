import {Component, Inject, OnInit} from '@angular/core';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {ProfessorSciWorkTypeRestService} from '../../../../services/rest-services/entities/professor-sci-work-type-rest.service';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {Faculty} from '../../../../models/entities/faculty';
import {PASS_STATUS, ServerResponse} from '../../../../constants/const';
import {Department} from '../../../../models/entities/department';
import {Professor} from '../../../../models/entities/professor';
import {Type} from '../../../../models/entities/type';

@Component({
  selector: 'app-professor-sci-work-filter',
  templateUrl: './professor-sci-work-filter.component.html',
  styleUrls: ['./professor-sci-work-filter.component.less']
})
export class ProfessorSciWorkFilterComponent implements OnInit {

  private facultyList: Faculty[];
  private departmentList: Department[];
  private professorList: Professor[];
  private defenseStatusList = PASS_STATUS;
  private professorSciWorkTypeList: Type[];

  constructor(
    private dialogRef: MatDialogRef<ProfessorSciWorkFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private professorRest: ProfessorRestService,
    private professorSciWorkTypeRest: ProfessorSciWorkTypeRestService,
    private notification: SnackBarService
  ) {
    this.getFacultyList();
    if (this.filter.faculty) {
      this.getDepartmentList();

      if (this.filter.department) {
        this.getProfessorList();
      }
    }
    this.getProfSciWorkTypeList();
  }

  ngOnInit() {
  }

  getFacultyList() {
    this.facultyRest.getAll().subscribe(
      (facultyList: Faculty[]) => {
        this.facultyList = facultyList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getDepartmentList(isReset?: boolean) {
    if (isReset) {
      this.filter.department = undefined;
      this.filter.professor = undefined;
    }
    this.departmentRest.getAll(this.filter.faculty.shortName).subscribe(
      (departmentList: Department[]) => {
        this.departmentList = departmentList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getProfessorList() {
    this.professorRest.getAll(this.filter.department.name).subscribe(
      (professorList: Professor[]) => {
        this.professorList = professorList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getProfSciWorkTypeList() {
    this.professorSciWorkTypeRest.getAll().subscribe(
      (professorSciWorkTypeList: Type[]) => {
        this.professorSciWorkTypeList = professorSciWorkTypeList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  compareFaculty(f1: Faculty, f2: Faculty) {
    if (f1 && f2) {
      return f1.id === f2.id;
    }
  }

  compareDepartment(d1: Department, d2: Department) {
    if (d1 && d2) {
      return d1.id === d2.id;
    }
  }

  compareProfessor(p1: Professor, p2: Professor) {
    if (p1 && p2) {
      return p1.id === p2.id;
    }
  }

  compareProfSciWorkType(pswt1: Type, pswt2: Type) {
    if (pswt1 && pswt2) {
      return pswt1.id === pswt2.id;
    }
  }

  clearDate() {
    this.filter.defenseDate = undefined;
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
