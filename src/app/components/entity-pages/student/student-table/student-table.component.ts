import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Student} from '../../../../models/entities/student';
import {StudentRestService} from '../../../../services/rest-services/entities/student-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';

import {StudentEditorComponent} from '../student-editor/student-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {StudentFilterComponent} from '../student-filter/student-filter.component';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.less']
})
export class StudentTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Sex', 'Last name', 'First name', 'Program', 'Study start year', 'Faculty', 'Group №', 'Education fund', 'Scholarship', ' '];
  fields: string[] = ['id', 'sex', 'lastName', 'firstName', 'studentGroup.specialtyField.specialty.program', 'studentGroup.startYear', 'studentGroup.specialtyField.specialty.faculty.shortName', 'studentGroup.number', 'eduFund.name', 'scholarship.type'];
  private dataSource: MatTableDataSource<Student>;
  private filter: EntityFilter;

  constructor(
    private http: StudentRestService,
    private dialog: MatDialog,
    private notification: SnackBarService
  ) {
    this.resetFilter();
  }

  ngOnInit() {
  }

  resetFilter() {
    this.filter = {
      orderByList: this.columns.slice(0, this.columns.length - 1),
      orderBy: this.columns[0],
      isAscending: true,
      sex: '',
      firstName: '',
      lastName: '',
      program: '',
      startYear: 0,
      faculty: undefined,
      number: 0,
      eduFund: undefined,
      scholarship: undefined
    };
    this.isFilterDefault = true;
    this.getStudentList();
  }

  getStudentList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Student>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Student>(entityPage.entityList);
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

    if (this.filter.sex) {
      filter += '&sex=' + this.filter.sex;
    }

    if (this.filter.firstName) {
      filter += '&fName=' + this.filter.firstName;
    }

    if (this.filter.lastName) {
      filter += '&lName=' + this.filter.lastName;
    }

    if (this.filter.program) {
      filter += '&program=' + this.filter.program;
    }

    if (this.filter.startYear) {
      filter += '&year=' + this.filter.startYear;
    }

    if (this.filter.faculty) {
      filter += '&facultyId=' + this.filter.faculty.id;
    }

    if (this.filter.number) {
      filter += '&number=' + this.filter.number;
    }

    if (this.filter.eduFund) {
      filter += '&eduFundId=' + this.filter.eduFund.id;
    }

    if (this.filter.scholarship) {
      filter += '&scholarshipId=' + this.filter.scholarship.id;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Student',
      editorMode: 'create'
    };

    this.dialog.open(StudentEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getStudentList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (student: Student) => {
        if (student) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Student',
            editorMode: 'edit',
            entity: student
          };

          this.dialog.open(StudentEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getStudentList();
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
          this.getStudentList();
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
    this.getStudentList();
  }

  openFilter() {
    this.dialog.open(StudentFilterComponent,
      {
        data: Object.assign({}, this.filter)/*,
        maxHeight: '90vh'*/
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getStudentList();
        }
      }
    );
  }

}
