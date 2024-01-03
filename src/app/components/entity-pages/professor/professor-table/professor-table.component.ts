import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Professor} from '../../../../models/entities/professor';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';

import {ProfessorEditorComponent} from '../professor-editor/professor-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {ProfessorFilterComponent} from '../professor-filter/professor-filter.component';

@Component({
  selector: 'app-professor-table',
  templateUrl: './professor-table.component.html',
  styleUrls: ['./professor-table.component.less']
})
export class ProfessorTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Sex', 'Last name', 'First name', 'Faculty', 'Department', 'Degree', ' '];
  fields: string[] = ['id', 'sex', 'lastName', 'firstName', 'department.faculty.shortName', 'department.name', 'degree.name'];
  private dataSource: MatTableDataSource<Professor>;
  private filter: EntityFilter;

  constructor(
    private http: ProfessorRestService,
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
      department: undefined,
      degree: undefined
    };
    this.isFilterDefault = true;
    this.getProfessorList();
  }

  getProfessorList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Professor>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Professor>(entityPage.entityList);
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

    if (this.filter.department) {
      filter += '&deptId=' + this.filter.department.id;
    }

    if (this.filter.degree) {
      filter += '&degreeId=' + this.filter.degree.id;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Professor',
      editorMode: 'create'
    };

    this.dialog.open(ProfessorEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getProfessorList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (professor: Professor) => {
        if (professor) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Professor',
            editorMode: 'edit',
            entity: professor
          };

          this.dialog.open(ProfessorEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getProfessorList();
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
          this.getProfessorList();
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
    this.getProfessorList();
  }

  openFilter() {
    this.dialog.open(ProfessorFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getProfessorList();
        }
      }
    );
  }

}
