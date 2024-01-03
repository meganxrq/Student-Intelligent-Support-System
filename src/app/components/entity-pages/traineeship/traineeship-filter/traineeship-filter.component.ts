import {Component, Inject, OnInit} from '@angular/core';
import {Faculty} from '../../../../models/entities/faculty';
import {ServerResponse} from '../../../../constants/const';
import {Department} from '../../../../models/entities/department';
import {Professor} from '../../../../models/entities/professor';
import {StudentGroup} from '../../../../models/entities/student-group';
import {Type} from '../../../../models/entities/type';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {TraineeshipTypeRestService} from '../../../../services/rest-services/entities/traineeship-type-rest.service';
import {Traineeship} from '../../../../models/entities/traineeship';

@Component({
  selector: 'app-traineeship-filter',
  templateUrl: './traineeship-filter.component.html',
  styleUrls: ['./traineeship-filter.component.less']
})
export class TraineeshipFilterComponent implements OnInit {

  private facultyList: Faculty[];
  private departmentList: Department[];
  private professorList: Professor[];
  private studentGroupList: StudentGroup[];
  private traineeshipTypeList: Type[];

  constructor(
    private dialogRef: MatDialogRef<TraineeshipFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private notification: SnackBarService,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private studentGroupRest: StudentGroupRestService,
    private traineeshipTypeRest: TraineeshipTypeRestService,
    private professorRest: ProfessorRestService,
  ) {
    this.getFacultyList();
    this.getStudentGroupList();
    this.getTraineeshipTypeList();
    if (this.filter.faculty) {
      this.getDepartmentList();

      if (this.filter.department) {
        this.getProfessorList();
      }
    }
  }

  ngOnInit() {
  }

  getTraineeshipTypeList() {
    this.traineeshipTypeRest.getAll().subscribe(
      (traineeshipTypeList: Type[]) => {
        this.traineeshipTypeList = traineeshipTypeList;
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

  compareTraineeshipType(t1: Traineeship, t2: Traineeship) {
    if (t1 && t2) {
      return t1.id === t2.id;
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
