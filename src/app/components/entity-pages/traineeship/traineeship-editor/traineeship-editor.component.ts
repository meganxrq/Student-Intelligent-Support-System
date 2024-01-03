import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TraineeshipRestService} from '../../../../services/rest-services/entities/traineeship-rest.service';
import {Traineeship} from '../../../../models/entities/traineeship';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {Type} from '../../../../models/entities/type';
import {Faculty} from '../../../../models/entities/faculty';
import {Department} from '../../../../models/entities/department';
import {Professor} from '../../../../models/entities/professor';
import {StudentGroup} from '../../../../models/entities/student-group';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {TraineeshipTypeRestService} from '../../../../services/rest-services/entities/traineeship-type-rest.service';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {DateTimeFormatterService} from '../../../../services/date-time-formatter.service';

@Component({
  selector: 'app-traineeship-editor',
  templateUrl: './traineeship-editor.component.html',
  styleUrls: ['./traineeship-editor.component.less']
})
export class TraineeshipEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private traineeshipTypeList: Type[];
  private facultyShortName: string;
  private facultyList: Faculty[];
  private departmentName: string;
  private departmentList: Department[];
  private professorList: Professor[];
  private studentGroupList: StudentGroup[];

  constructor(
    private dialogRef: MatDialogRef<TraineeshipEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private traineeshipRest: TraineeshipRestService,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private professorRest: ProfessorRestService,
    private traineeshipTypeRest: TraineeshipTypeRestService,
    private studentGroupRest: StudentGroupRestService,
    private notification: SnackBarService,
    private dateTimeFormatter: DateTimeFormatterService
  ) {
    this.getFacultyList();
    this.getStudentGroupList();
    this.getTraineeshipTypeList();
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        professor: {},
        studentGroup: [],
        traineeshipType: {},
        startDate: '',
        endDate: ''
      };
      this.data.entity.studentGroup = new Array(0);
    } else {
      this.facultyShortName = this.data.entity.professor.department.faculty.shortName;
      this.departmentName = this.data.entity.professor.department.name;
      this.getDepartmentList();
      this.getProfessorList();
    }
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
      this.departmentName = undefined;
      this.data.entity.professor = {};
    }
    this.departmentRest.getAll(this.facultyShortName).subscribe(
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
    this.professorRest.getAll(this.departmentName).subscribe(
      (professorList: Professor[]) => {
        this.professorList = professorList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.startDate = this.dateTimeFormatter.get_yyyy_MM_dd(this.data.entity.startDate);
    this.data.entity.endDate = this.dateTimeFormatter.get_yyyy_MM_dd(this.data.entity.endDate);

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.traineeshipRest.update(this.data.entity).subscribe(
        (traineeship: Traineeship) => {
          if (traineeship) {
            this.dialogRef.close({refresh: true});
            this.notify(ServerResponse.SUCCESS);
          } else {
            this.notify(ServerResponse.NO_SUCH_RECORD);
          }
        },
        error => {
          this.notify(ServerResponse.NO_RESPONSE);
        }
      );
    } else if (this.data.editorMode.toLowerCase() === 'create') {
      this.traineeshipRest.create(this.data.entity).subscribe(
        (traineeship: Traineeship) => {
          if (traineeship) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Traineeship has ID = ' + traineeship.id);
          } else {
            this.notify(ServerResponse.RECORD_ALREADY_EXISTS);
          }
        },
        error => {
          this.notify(ServerResponse.NO_RESPONSE);
        }
      );
    }
  }

  compareProfessor(p1: Professor, p2: Professor) {
    return p1.id === p2.id;
  }

  compareStudentGroup(sg1: StudentGroup, sg2: StudentGroup) {
    return sg1.id === sg2.id;
  }

  compareTraineeshipType(tt1: Type, tt2: Type) {
    return tt1.id === tt2.id;
  }

  disableSaveBtn(): boolean {
    return this.isSaveBtnDisabled
      || !this.data.entity.professor.id
      || this.data.entity.studentGroup.length === 0
      || !this.data.entity.traineeshipType.type
      || !this.data.entity.startDate
      || !this.data.entity.endDate;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
