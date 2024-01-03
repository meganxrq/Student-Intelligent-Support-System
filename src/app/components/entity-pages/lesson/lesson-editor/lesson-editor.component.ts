import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LessonRestService} from '../../../../services/rest-services/entities/lesson-rest.service';
import {Lesson} from '../../../../models/entities/lesson';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {Department} from '../../../../models/entities/department';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {Professor} from '../../../../models/entities/professor';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {Subject} from '../../../../models/entities/subject';
import {SubjectRestService} from '../../../../services/rest-services/entities/subject-rest.service';
import {StudentGroup} from '../../../../models/entities/student-group';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {Type} from '../../../../models/entities/type';
import {LessonTypeRestService} from '../../../../services/rest-services/entities/lesson-type-rest.service';
import {TestingTypeRestService} from '../../../../services/rest-services/entities/testing-type-rest.service';
import {Faculty} from '../../../../models/entities/faculty';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {DateTimeFormatterService} from '../../../../services/date-time-formatter.service';

@Component({
  selector: 'app-lesson-editor',
  templateUrl: './lesson-editor.component.html',
  styleUrls: ['./lesson-editor.component.less']
})
export class LessonEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyShortName: string;
  private facultyList: Faculty[];
  private departmentName: string;
  private departmentList: Department[];
  private professorList: Professor[];
  private subjectList: Subject[];
  private studentGroupList: StudentGroup[];
  private lessonTypeList: Type[];
  private testingTypeList: Type[];

  constructor(
    private dialogRef: MatDialogRef<LessonEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private facultyRest: FacultyRestService,
    private lessonRest: LessonRestService,
    private departmentRest: DepartmentRestService,
    private professorRest: ProfessorRestService,
    private subjectRest: SubjectRestService,
    private studentGroupRest: StudentGroupRestService,
    private lessonTypeRest: LessonTypeRestService,
    private testingTypeRest: TestingTypeRestService,
    private notification: SnackBarService,
    private dateTimeFormatter: DateTimeFormatterService
  ) {
    this.getFacultyList();
    this.getSubjectList();
    this.getStudentGroupList();
    this.getLessonTypeList();
    this.getTestingTypeList();
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        professor: {},
        subject: {},
        studentGroup: [],
        testingType: {},
        lessonType: {},
        startDate: '',
        endDate: '',
        hourCount: 0
      };
      this.data.entity.studentGroup = new Array(0);
    } else {
      this.facultyShortName = this.data.entity.professor.department.faculty.shortName;
      this.departmentName = this.data.entity.professor.department.name;
      this.getDepartmentList();
      this.getProfessorList();
    }
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

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.startDate = this.dateTimeFormatter.get_yyyy_MM_dd(this.data.entity.startDate);
    this.data.entity.endDate = this.dateTimeFormatter.get_yyyy_MM_dd(this.data.entity.endDate);

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.lessonRest.update(this.data.entity).subscribe(
        (lesson: Lesson) => {
          if (lesson) {
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
      this.lessonRest.create(this.data.entity).subscribe(
        (lesson: Lesson) => {
          if (lesson) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Lesson has ID = ' + lesson.id);
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

  compareSubject(s1: Subject, s2: Subject) {
    return s1.id === s2.id;
  }

  compareStudentGroup(sg1: StudentGroup, sg2: StudentGroup) {
    return sg1.id === sg2.id;
  }

  compareLessonType(lt1: Type, lt2: Type) {
    return lt1.id === lt2.id;
  }

  compareTestingType(tt1: Type, tt2: Type) {
    return tt1.id === tt2.id;
  }

  disableSaveBtn(): boolean {
    return this.isSaveBtnDisabled
      || !this.data.entity.professor.id
      || !this.data.entity.subject.id
      || this.data.entity.studentGroup.length === 0
      || !this.data.entity.lessonType.type
      || !this.data.entity.testingType.type
      || !this.data.entity.startDate
      || !this.data.entity.endDate
      || this.data.entity.hourCount < 1
      || this.data.entity.hourCount > 255;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
