import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {StudentProgress} from '../../../../models/entities/student-progress';
import {StudentProgressRestService} from '../../../../services/rest-services/entities/student-progress-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {StudentProgressEditorComponent} from '../student-progress-editor/student-progress-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {StudentProgressFilterComponent} from '../student-progress-filter/student-progress-filter.component';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../models/user';

@Component({
  selector: 'app-student-progress-table',
  templateUrl: './student-progress-table.component.html',
  styleUrls: ['./student-progress-table.component.less']
})
export class StudentProgressTableComponent implements OnInit {

  private defaultColumns: string[] = ['ID', 'Last name', 'First name', 'Subject', 'Professor', 'Testing type', 'Lesson type', 'Current score', 'Final score', 'Miss hours', ' '];
  private defaultFields: string[] = ['id', 'student.lastName', 'student.firstName', 'lesson.subject.shortName', 'lesson.professor.lastName', 'lesson.testingType.type', 'lesson.lessonType.type', 'currentScore', 'finalScore', 'missCount'];
  private defaultOrderByList: string[] = ['ID', 'Last name', 'First name', 'Subject', 'Professor', 'Testing type', 'Lesson type', 'Miss hours'];

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[];
  private fields: string[];
  private orderByList: string[];
  private dataSource: MatTableDataSource<StudentProgress>;
  private filter: EntityFilter;

  constructor(
    private http: StudentProgressRestService,
    private dialog: MatDialog,
    private notification: SnackBarService,
    private userService: UserService
  ) {
    if (!this.userService.isAdmin()) {
      // either student or professor
      this.defaultColumns.shift();
      this.defaultFields.shift();
      this.defaultOrderByList.shift();
    }
    this.columns = this.defaultColumns;
    this.fields = this.defaultFields;
    this.orderByList = this.defaultOrderByList;
    this.resetFilter();
  }

  ngOnInit() {
  }

  resetFilter() {
    this.filter = {
      orderByList: this.orderByList,
      orderBy: this.orderByList[0],
      isAscending: true,
      showGroup: true,
      studentGroup: undefined,
      student: undefined,
      subject: undefined,
      showProfessor: true,
      professor: undefined,
      testingType: undefined,
      lessonType: undefined,
      passStatus: ''
    };
    if (this.userService.isStudent()) { // student
      this.filter.showGroup = false;
      this.loadStudentGroup();
      // this.loadStudent();
    } else if (this.userService.isProfessor()) { // professor
      this.filter.showProfessor = false;
      this.loadProfessor();
    }
    this.columns = this.defaultColumns;
    this.fields = this.defaultFields;
    this.orderByList = this.defaultOrderByList;
    this.isFilterDefault = true;
    this.getStudentProgressList();
  }

  showOnlyMe() {
    this.loadStudent();
    this.isFilterDefault = false;
    this.getStudentProgressList();
  }

  getStudentProgressList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<StudentProgress>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<StudentProgress>(entityPage.entityList);
        this.showTable = true;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  makeFilterForHttp(): string {
    let filter = '';

    if (this.filter.studentGroup) {
      filter += '&groupId=' + this.filter.studentGroup.id;
    }

    if (this.filter.student) {
      filter += '&studId=' + this.filter.student.id;
      this.hideStudentFCs(true);
    } else {
      this.hideStudentFCs(false);
    }

    if (this.filter.professor) {
      filter += '&profId=' + this.filter.professor.id;
    }

    if (this.filter.subject) {
      filter += '&subjId=' + this.filter.subject.id;
    }

    if (this.filter.testingType) {
      filter += '&tTypeId=' + this.filter.testingType.id;
    }

    if (this.filter.lessonType) {
      filter += '&lTypeId=' + this.filter.lessonType.id;
    }

    if (this.filter.passStatus) {
      filter += '&pass=' + this.filter.passStatus;
    }

    filter = '?orderBy=' + this.filter.orderBy +
      '&isAsc=' + this.filter.isAscending + filter;

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    if (get(object, path)) {
      return get(object, path);
    }
    return '';
  }

  /*create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new StudentProgress',
      editorMode: 'create'
    };

    this.dialog.open(StudentProgressEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getStudentProgressList();
        }
      }
    );
  }*/

  edit(id: number) {
    this.http.getById(id).subscribe(
      (studentProgress: StudentProgress) => {
        if (studentProgress) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the StudentProgress',
            editorMode: 'edit',
            entity: studentProgress
          };

          this.dialog.open(StudentProgressEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getStudentProgressList();
              }
            }
          );
        } else {
          this.notification.open(ServerResponse.NO_SUCH_RECORD);
        }
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  /*delete(id: number) {
    this.http.deleteByIds([id]).subscribe(
      (deleteCount: number) => {
        if (deleteCount === 1) {
          this.notification.open(ServerResponse.SUCCESS);
          this.getStudentProgressList();
        } else {
          this.notification.open(ServerResponse.NOT_ALL_DELETED);
        }
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }*/

  setPage(event?: PageEvent) {
    this.currentPagination = '&page=' + event.pageIndex + '&size=' + event.pageSize;
    this.getStudentProgressList();
  }

  openFilter() {
    this.dialog.open(StudentProgressFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getStudentProgressList();
        }
      }
    );
  }

  hideStudentFCs(hide: boolean) {
    if (hide) {
      this.columns = ['Subject', 'Professor', 'Testing type', 'Lesson type', 'Current score', 'Final score', 'Miss hours', ' '];
      this.fields = ['lesson.subject.shortName', 'lesson.professor.lastName', 'lesson.testingType.type', 'lesson.lessonType.type', 'currentScore', 'finalScore', 'missCount'];
      this.filter.orderByList = ['Subject', 'Professor', 'Testing type', 'Lesson type', 'Miss hours'];
      if (['ID', 'Last name', 'First name'].includes(this.filter.orderBy)) {
        this.filter.orderBy = this.filter.orderByList[0];
      }
    } else {
      this.columns = this.defaultColumns;
      this.fields = this.defaultFields;
      this.filter.orderByList = this.defaultOrderByList;
    }
  }

  isShowOnlyMeShown(): boolean {
    return this.userService.isStudent()
      && this.filter.student === undefined;
  }

  loadStudentGroup() {
    const user: User = this.userService.getMe();
    this.filter.studentGroup = {
      eduForm: user.studentGroup.eduForm,
      id: user.studentGroup.id,
      number: user.studentGroup.number,
      specialtyField: user.studentGroup.specialtyField,
      startYear: user.studentGroup.startYear
    };
  }

  loadStudent() {
    const user: User = this.userService.getMe();
    this.filter.student = {
      eduFund: user.eduFund,
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      password: '',
      scholarship: user.scholarship,
      sex: user.sex,
      studentGroup: user.studentGroup,
      username: ''
    };
  }

  loadProfessor() {
    const user: User = this.userService.getMe();
    this.filter.professor = {
      degree: user.degree,
      department: user.department,
      username: '',
      firstName: user.firstName,
      id: user.id,
      lastName: user.lastName,
      password: '',
      sex: user.sex
    };
  }

}
