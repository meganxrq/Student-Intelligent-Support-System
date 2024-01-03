import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {StudentSciWork} from '../../../../models/entities/student-sci-work';
import {StudentSciWorkRestService} from '../../../../services/rest-services/entities/student-sci-work-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';

import {StudentSciWorkEditorComponent} from '../student-sci-work-editor/student-sci-work-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {StudentSciWorkFilterComponent} from '../student-sci-work-filter/student-sci-work-filter.component';
import {DateTimeFormatterService} from '../../../../services/date-time-formatter.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-student-sci-work-table',
  templateUrl: './student-sci-work-table.component.html',
  styleUrls: ['./student-sci-work-table.component.less']
})
export class StudentSciWorkTableComponent implements OnInit {

  private defaultColumns: string[] = ['ID', 'Last name', 'First name', 'Study start year', 'Faculty', 'Group №', 'Professor', 'Type', 'Topic', 'Defense status', 'Defense date', ' '];
  private defaultFields: string[] = ['id', 'student.lastName', 'student.firstName', 'student.studentGroup.startYear', 'student.studentGroup.specialtyField.specialty.faculty.shortName', 'student.studentGroup.number', 'professor.lastName', 'studentSciWorkType.type', 'topic', 'defenseStatus', 'defenseDate'];
  private defaultOrderByList: string[] = this.defaultColumns.slice(0, this.defaultColumns.length - 1);

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[];
  private fields: string[];
  private orderByList: string[];
  private dataSource: MatTableDataSource<StudentSciWork>;
  private filter: EntityFilter;

  constructor(
    private http: StudentSciWorkRestService,
    private dialog: MatDialog,
    private notification: SnackBarService,
    private dateTimeFormatter: DateTimeFormatterService,
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
      studentGroup: undefined,
      student: undefined,
      faculty: undefined,
      department: undefined,
      professor: undefined,
      studentSciWorkType: undefined,
      topic: '',
      defenseStatus: '',
      defenseDate: ''
    };
    this.isFilterDefault = true;
    this.getStudentSciWorkList();
  }

  getStudentSciWorkList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<StudentSciWork>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<StudentSciWork>(entityPage.entityList);
        this.showTable = true;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  makeFilterForHttp(): string {
    let filter = '?orderBy=' + this.filter.orderBy +
      '&isAsc=' + this.filter.isAscending;

    if (this.filter.studentGroup) {
      filter += '&groupId=' + this.filter.studentGroup.id;
    }

    if (this.filter.student) {
      filter += '&studentId=' + this.filter.student.id;
    }

    if (this.filter.faculty) {
      filter += '&facultyId=' + this.filter.faculty.id;
    }

    if (this.filter.department) {
      filter += '&deptId=' + this.filter.department.id;
    }

    if (this.filter.professor) {
      filter += '&profId=' + this.filter.professor.id;
    }

    if (this.filter.studentSciWorkType) {
      filter += '&workTypeId=' + this.filter.studentSciWorkType.id;
    }

    if (this.filter.topic) {
      filter += '&topic=' + this.filter.topic;
    }

    if (this.filter.defenseStatus) {
      filter += '&status=' + this.filter.defenseStatus;
    }

    if (this.filter.defenseDate) {
      filter += '&date=' + this.dateTimeFormatter.get_yyyy_MM_dd(this.filter.defenseDate);
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new StudentSciWork',
      editorMode: 'create'
    };

    this.dialog.open(StudentSciWorkEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getStudentSciWorkList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (studentSciWork: StudentSciWork) => {
        if (studentSciWork) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the StudentSciWork',
            editorMode: 'edit',
            entity: studentSciWork
          };

          this.dialog.open(StudentSciWorkEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getStudentSciWorkList();
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

  delete(id: number) {
    this.http.deleteByIds([id]).subscribe(
      (deleteCount: number) => {
        if (deleteCount === 1) {
          this.notification.open(ServerResponse.SUCCESS);
          this.getStudentSciWorkList();
        } else {
          this.notification.open(ServerResponse.NOT_ALL_DELETED);
        }
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  setPage(event?: PageEvent) {
    this.currentPagination = '&page=' + event.pageIndex + '&size=' + event.pageSize;
    this.getStudentSciWorkList();
  }

  openFilter() {
    this.dialog.open(StudentSciWorkFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getStudentSciWorkList();
        }
      }
    );
  }

}
