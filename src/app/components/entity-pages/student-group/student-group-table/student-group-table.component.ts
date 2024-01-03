import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {StudentGroup} from '../../../../models/entities/student-group';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {StudentGroupEditorComponent} from '../student-group-editor/student-group-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {StudentGroupFilterComponent} from '../student-group-filter/student-group-filter.component';

@Component({
  selector: 'app-student-group-table',
  templateUrl: './student-group-table.component.html',
  styleUrls: ['./student-group-table.component.less']
})
export class StudentGroupTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Study start year', 'Faculty', 'Number', 'Program', 'Education form', ' '];
  fields: string[] = ['id', 'startYear', 'specialtyField.specialty.faculty.shortName', 'number', 'specialtyField.specialty.program', 'eduForm.name'];
  private dataSource: MatTableDataSource<StudentGroup>;
  private filter: EntityFilter;

  constructor(
    private http: StudentGroupRestService,
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
      number: 0,
      specialtyField: undefined,
      eduForm: undefined,
      startYear: 0,
      program: ''
    };
    this.isFilterDefault = true;
    this.getStudentGroupList();
  }

  getStudentGroupList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<StudentGroup>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<StudentGroup>(entityPage.entityList);
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

    if (this.filter.startYear) {
      filter += '&year=' + this.filter.startYear;
    }

    if (this.filter.number) {
      filter += '&number=' + this.filter.number;
    }

    if (this.filter.specialtyField) {
      filter += '&fieldId=' + this.filter.specialtyField.id;
    }

    if (this.filter.program) {
      filter += '&program=' + this.filter.program;
    }

    if (this.filter.eduForm) {
      filter += '&eduFormId=' + this.filter.eduForm.id;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new StudentGroup',
      editorMode: 'create'
    };

    this.dialog.open(StudentGroupEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getStudentGroupList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (studentGroup: StudentGroup) => {
        if (studentGroup) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the StudentGroup',
            editorMode: 'edit',
            entity: studentGroup
          };

          this.dialog.open(StudentGroupEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getStudentGroupList();
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
          this.getStudentGroupList();
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
    this.getStudentGroupList();
  }

  openFilter() {
    this.dialog.open(StudentGroupFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getStudentGroupList();
        }
      }
    );
  }

}
