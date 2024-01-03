import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {TraineeshipProgressFilterComponent} from '../traineeship-progress-filter/traineeship-progress-filter.component';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../models/user';
import {TraineeshipProgress} from '../../../../models/entities/traineeship-progress';
import {TraineeshipProgressRestService} from '../../../../services/rest-services/entities/traineeship-progress-rest.service';
import {TraineeshipProgressEditorComponent} from '../traineeship-progress-editor/traineeship-progress-editor.component';

@Component({
  selector: 'app-traineeship-progress-table',
  templateUrl: './traineeship-progress-table.component.html',
  styleUrls: ['./traineeship-progress-table.component.less']
})
export class TraineeshipProgressTableComponent implements OnInit {

  private defaultColumns: string[] = ['ID', 'Last name', 'First name', 'Traineeship', 'Professor', 'Start date', 'End date', 'Final score', ' '];
  private defaultFields: string[] = ['id', 'student.lastName', 'student.firstName', 'traineeship.traineeshipType.type', 'traineeship.professor.lastName', 'traineeship.startDate', 'traineeship.endDate', 'finalScore'];
  private defaultOrderByList: string[] = ['ID', 'Last name', 'First name', 'Traineeship', 'Professor', 'Final score'];

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns;
  private fields;
  private orderByList;
  private dataSource: MatTableDataSource<TraineeshipProgress>;
  private filter: EntityFilter;

  constructor(
    private http: TraineeshipProgressRestService,
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
      traineeship: undefined,
      showProfessor: true,
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
    this.getTraineeshipProgressList();
  }

  showOnlyMe() {
    this.loadStudent();
    this.isFilterDefault = false;
    this.getTraineeshipProgressList();
  }

  getTraineeshipProgressList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<TraineeshipProgress>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<TraineeshipProgress>(entityPage.entityList);
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

    if (this.filter.traineeship) {
      filter += '&traineeshipId=' + this.filter.traineeship.id;
    }

    if (this.filter.professor) {
      filter += '&profId=' + this.filter.professor.id;
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
      label: 'Create new TraineeshipProgress',
      editorMode: 'create'
    };

    this.dialog.open(TraineeshipProgressEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getTraineeshipProgressList();
        }
      }
    );
  }*/

  edit(id: number) {
    this.http.getById(id).subscribe(
      (traineeshipProgress: TraineeshipProgress) => {
        if (traineeshipProgress) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the TraineeshipProgress',
            editorMode: 'edit',
            entity: traineeshipProgress
          };

          this.dialog.open(TraineeshipProgressEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getTraineeshipProgressList();
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
          this.getTraineeshipProgressList();
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
    this.getTraineeshipProgressList();
  }

  openFilter() {
    this.dialog.open(TraineeshipProgressFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getTraineeshipProgressList();
        }
      }
    );
  }

  hideStudentFCs(hide: boolean) {
    if (hide) {
      this.columns = ['Traineeship', 'Professor', 'Start date', 'End date', 'Final score', ' '];
      this.fields = ['traineeship.traineeshipType.type', 'traineeship.professor.lastName', 'traineeship.startDate', 'traineeship.endDate', 'finalScore'];
      this.filter.orderByList = ['Traineeship', 'Professor', 'Final score'];
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
