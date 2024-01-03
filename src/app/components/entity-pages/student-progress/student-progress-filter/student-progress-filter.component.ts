import {Component, Inject, OnInit} from '@angular/core';
import {PASS_STATUS, ServerResponse} from '../../../../constants/const';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {StudentGroup} from '../../../../models/entities/student-group';
import {Student} from '../../../../models/entities/student';
import {StudentRestService} from '../../../../services/rest-services/entities/student-rest.service';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {Subject} from '../../../../models/entities/subject';
import {Professor} from '../../../../models/entities/professor';
import {LessonRestService} from '../../../../services/rest-services/entities/lesson-rest.service';
import {Lesson} from '../../../../models/entities/lesson';
import {Type} from '../../../../models/entities/type';

@Component({
  selector: 'app-student-progress-filter',
  templateUrl: './student-progress-filter.component.html',
  styleUrls: ['./student-progress-filter.component.less']
})
export class StudentProgressFilterComponent implements OnInit {

  private studentGroupList: StudentGroup[];
  private studentList: Student[];
  private subjectList: Subject[] = [];
  private professorList: Professor[] = [];
  private lessonTypeList: Type[] = [];
  private testingTypeList: Type[] = [];
  private passStatusList = PASS_STATUS;

  constructor(
    private dialogRef: MatDialogRef<StudentProgressFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private studentGroupRest: StudentGroupRestService,
    private studentRest: StudentRestService,
    private lessonRest: LessonRestService,
    private notification: SnackBarService
  ) {
    if (this.filter.showGroup) { // admin - professor mode
      if (this.filter.showProfessor) { // admin mode
        this.getStudentGroupList();
      } else { // professor mode
        this.getStudentGroupList(this.filter.professor.id);
      }
    } else { // student mode

    }
    if (this.filter.studentGroup) {
      this.getAllDataViaGroup();
    }
  }

  ngOnInit() {
  }

  getStudentGroupList(professorId?: number) {
    if (professorId) {
      this.lessonRest.getGroupsByProfessor(professorId).subscribe(
        (studentGroupList: StudentGroup[]) => {
          this.studentGroupList = studentGroupList;
        },
        error => {
          console.log(error.message);
          this.notification.open(ServerResponse.NO_RESPONSE);
        }
      );
    } else {
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
  }

  getAllDataViaGroup(isReset?: boolean) {
    if (isReset) {
      this.resetDataAfterChangingGroup();
    }
    // Student list
    this.studentRest.getAll(this.filter.studentGroup.id).subscribe(
      (studentList: Student[]) => {
        this.studentList = studentList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
    // Lesson list
    let profId: number;
    if (this.filter.professor) {
      profId = this.filter.professor.id;
    }
    this.lessonRest.getAll(this.filter.studentGroup.id, profId).subscribe(
      (lessonList: Lesson[]) => {
        for (const lesson of lessonList) {
          if (!this.subjectList.find(subject => subject.id === lesson.subject.id)) {
            this.subjectList.push(lesson.subject);
          }
          if (this.filter.showProfessor) { // admin - student mode
            if (!this.professorList.find(professor => professor.id === lesson.professor.id)) {
              this.professorList.push(lesson.professor);
            }
          }
          if (!this.lessonTypeList.find(lessonType => lessonType.id === lesson.lessonType.id)) {
            this.lessonTypeList.push(lesson.lessonType);
          }
          if (!this.testingTypeList.find(testingType => testingType.id === lesson.testingType.id)) {
            this.testingTypeList.push(lesson.testingType);
          }
        }
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

  resetDataAfterChangingGroup() {
    this.filter.student = undefined;
    this.subjectList = [];
    this.filter.subject = undefined;
    if (this.filter.showProfessor) { // student - admin
      this.professorList = [];
      this.filter.professor = undefined;
    }
    this.lessonTypeList = [];
    this.filter.lessonType = undefined;
    this.testingTypeList = [];
    this.filter.testingType = undefined;
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
