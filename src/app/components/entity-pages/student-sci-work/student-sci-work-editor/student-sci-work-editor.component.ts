import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StudentSciWorkRestService} from '../../../../services/rest-services/entities/student-sci-work-rest.service';
import {StudentSciWork} from '../../../../models/entities/student-sci-work';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {PASS_STATUS, ServerResponse} from '../../../../constants/const';
import {Faculty} from '../../../../models/entities/faculty';
import {Department} from '../../../../models/entities/department';
import {Professor} from '../../../../models/entities/professor';
import {Type} from '../../../../models/entities/type';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {DateTimeFormatterService} from '../../../../services/date-time-formatter.service';
import {StudentSciWorkTypeRestService} from '../../../../services/rest-services/entities/student-sci-work-type-rest.service';
import {StudentRestService} from '../../../../services/rest-services/entities/student-rest.service';
import {Student} from '../../../../models/entities/student';
import {StudentGroup} from '../../../../models/entities/student-group';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-student-sci-work-editor',
  templateUrl: './student-sci-work-editor.component.html',
  styleUrls: ['./student-sci-work-editor.component.less']
})
export class StudentSciWorkEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyShortName: string;
  private studentGroup: StudentGroup;
  private studentGroupList: StudentGroup[];
  private studentList: Student[];
  private facultyList: Faculty[];
  private departmentName: string;
  private departmentList: Department[];
  private professorList: Professor[];
  private defenseStatusList = PASS_STATUS;
  private studentSciWorkTypeList: Type[];

  constructor(
    private dialogRef: MatDialogRef<StudentSciWorkEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private studentSciWorkRest: StudentSciWorkRestService,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private professorRest: ProfessorRestService,
    private studentGroupRest: StudentGroupRestService,
    private studentRest: StudentRestService,
    private studentSciWorkTypeRest: StudentSciWorkTypeRestService,
    private notification: SnackBarService,
    private dateTimeFormatter: DateTimeFormatterService,
    private userService: UserService
  ) {
    this.getStudentGroupList();
    this.getFacultyList();
    this.getStudSciWorkTypeList();
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        studentSciWorkType: {},
        topic: '',
        student: {},
        professor: {}
      };
    } else {
      this.studentGroup = this.data.entity.student.studentGroup;
      this.facultyShortName = this.data.entity.professor.department.faculty.shortName;
      this.departmentName = this.data.entity.professor.department.name;
      this.getStudentList();
      this.getDepartmentList();
      this.getProfessorList();
    }
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
      this.data.entity.student = undefined;
    }
    this.studentRest.getAll(this.studentGroup.id).subscribe(
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

  getStudSciWorkTypeList() {
    this.studentSciWorkTypeRest.getAll().subscribe(
      (studentSciWorkTypeList: Type[]) => {
        this.studentSciWorkTypeList = studentSciWorkTypeList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.topic = this.data.entity.topic.trim().replace(/\s\s+/g, ' ');
    this.data.entity.defenseDate = this.dateTimeFormatter.get_yyyy_MM_dd(this.data.entity.defenseDate);

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.studentSciWorkRest.update(this.data.entity).subscribe(
        (studentSciWork: StudentSciWork) => {
          if (studentSciWork) {
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
      this.studentSciWorkRest.create(this.data.entity).subscribe(
        (studentSciWork: StudentSciWork) => {
          if (studentSciWork) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New StudentSciWork has ID = ' + studentSciWork.id);
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
    this.data.entity.defenseDate = undefined;
  }

  disableSaveBtn(): boolean {
    return this.isSaveBtnDisabled
      || !this.data.entity.student
      || !this.data.entity.professor
      || !this.data.entity.studentSciWorkType.type
      || !this.data.entity.topic
      || (this.data.entity.defenseStatus && !this.data.entity.defenseDate)
      || (!this.data.entity.defenseStatus && this.data.entity.defenseDate);
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
