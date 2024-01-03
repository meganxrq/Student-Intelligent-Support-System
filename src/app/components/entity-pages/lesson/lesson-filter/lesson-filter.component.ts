import {Component, Inject, OnInit} from '@angular/core';
import {Faculty} from '../../../../models/entities/faculty';
import {Department} from '../../../../models/entities/department';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {SubjectRestService} from '../../../../services/rest-services/entities/subject-rest.service';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {LessonTypeRestService} from '../../../../services/rest-services/entities/lesson-type-rest.service';
import {TestingTypeRestService} from '../../../../services/rest-services/entities/testing-type-rest.service';
import {Professor} from '../../../../models/entities/professor';
import {Subject} from '../../../../models/entities/subject';
import {StudentGroup} from '../../../../models/entities/student-group';
import {Type} from '../../../../models/entities/type';

@Component({
  selector: 'app-lesson-filter',
  templateUrl: './lesson-filter.component.html',
  styleUrls: ['./lesson-filter.component.less']
})
export class LessonFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private faculty: Faculty;
  private facultyList: Faculty[];
  private departmentList: Department[];
  private professorList: Professor[];
  private subjectList: Subject[];
  private studentGroupList: StudentGroup[];
  private lessonTypeList: Type[];
  private testingTypeList: Type[];

  constructor(
    private dialogRef: MatDialogRef<LessonFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private notification: SnackBarService,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private professorRest: ProfessorRestService,
    private subjectRest: SubjectRestService,
    private studentGroupRest: StudentGroupRestService,
    private lessonTypeRest: LessonTypeRestService,
    private testingTypeRest: TestingTypeRestService
  ) {
    this.getFacultyList();
    if (this.filter.department) {
      this.faculty = this.filter.department.faculty;
      this.getDepartmentList();
      this.getProfessorList();
    }
    this.getSubjectList();
    this.getStudentGroupList();
    this.getLessonTypeList();
    this.getTestingTypeList();
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
    this.departmentRest.getAll(this.faculty.shortName).subscribe(
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

  getSubjectList() {
    this.subjectRest.getAll().subscribe(
      (subjectList: Subject[]) => {
        this.subjectList = subjectList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
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

  getLessonTypeList() {
    this.lessonTypeRest.getAll().subscribe(
      (lessonTypeList: Type[]) => {
        this.lessonTypeList = lessonTypeList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getTestingTypeList() {
    this.testingTypeRest.getAll().subscribe(
      (testingTypeList: Type[]) => {
        this.testingTypeList = testingTypeList;
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

  compareSubject(s1: Subject, s2: Subject) {
    if (s1 && s2) {
      return s1.id === s2.id;
    }
  }

  compareLessonType(lt1: Type, lt2: Type) {
    if (lt1 && lt2) {
      return lt1.id === lt2.id;
    }
  }

  compareTestingType(tt1: Type, tt2: Type) {
    if (tt1 && tt2) {
      return tt1.id === tt2.id;
    }
  }

  clearStartDate() {
    this.filter.startDate = undefined;
  }

  clearEndDate() {
    this.filter.endDate = undefined;
  }

  save() {
    this.dialogRef.close(this.filter);
  }

  disableSaveBtn(): boolean {
    return this.isSaveBtnDisabled
      || (this.faculty !== undefined && this.filter.department === undefined);
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
