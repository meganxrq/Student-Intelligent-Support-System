import {Component, Inject, OnInit} from '@angular/core';
import {Faculty} from '../../../../models/entities/faculty';
import {Department} from '../../../../models/entities/department';
import {Professor} from '../../../../models/entities/professor';
import {PASS_STATUS, ServerResponse} from '../../../../constants/const';
import {Type} from '../../../../models/entities/type';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {StudentGroup} from '../../../../models/entities/student-group';
import {Student} from '../../../../models/entities/student';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {StudentRestService} from '../../../../services/rest-services/entities/student-rest.service';
import {StudentSciWorkTypeRestService} from '../../../../services/rest-services/entities/student-sci-work-type-rest.service';

@Component({
  selector: 'app-student-sci-work-filter',
  templateUrl: './student-sci-work-filter.component.html',
  styleUrls: ['./student-sci-work-filter.component.less']
})
export class StudentSciWorkFilterComponent implements OnInit {

  private studentGroupList: StudentGroup[];
  private studentList: Student[];
  private facultyList: Faculty[];
  private departmentList: Department[];
  private professorList: Professor[];
  private defenseStatusList = PASS_STATUS;
  private studSciWorkTypeList: Type[];

  constructor(
    private dialogRef: MatDialogRef<StudentSciWorkFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private studentGroupRest: StudentGroupRestService,
    private studentRest: StudentRestService,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private professorRest: ProfessorRestService,
    private studentSciWorkTypeRest: StudentSciWorkTypeRestService,
    private notification: SnackBarService
  ) {
    this.getStudentGroupList();
    this.getFacultyList();
    if (this.filter.studentGroup) {
      this.getStudentList();
    }
    if (this.filter.faculty) {
      this.getDepartmentList();

      if (this.filter.department) {
        this.getProfessorList();
      }
    }
    this.getStudSciWorkTypeList();
  }

  ngOnInit() {
  }

  getStudentGroupList() {
    this.studentGroupRest.getAll().subscribe(
      (studentGroupList: StudentGroup[]) => {
        this.studentGroupList = studentGroupList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getStudentList(isReset?: boolean) {
    if (isReset) {
      this.filter.student = undefined;
    }
    this.studentRest.getAll(this.filter.studentGroup.id).subscribe(
      (studentList: Student[]) => {
        this.studentList = studentList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
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

  getStudSciWorkTypeList() {
    this.studentSciWorkTypeRest.getAll().subscribe(
      (studSciWorkTypeList: Type[]) => {
        this.studSciWorkTypeList = studSciWorkTypeList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  compareStudentGroup(sg1: StudentGroup, sg2: StudentGroup) {
    if (sg1 && sg2) {
      return sg1.id === sg2.id;
    }
  }

  compareStudent(s1: Student, s2: Student) {
    if (s1 && s2) {
      return s1.id === s2.id;
    }
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

  compareStudSciWorkType(sswt1: Type, sswt2: Type) {
    if (sswt1 && sswt2) {
      return sswt1.id === sswt2.id;
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
