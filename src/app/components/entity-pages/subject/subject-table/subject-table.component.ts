import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Subject} from '../../../../models/entities/subject';
import {SubjectRestService} from '../../../../services/rest-services/entities/subject-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';

import {SubjectEditorComponent} from '../subject-editor/subject-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {SubjectFilterComponent} from '../subject-filter/subject-filter.component';

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.less']
})
export class SubjectTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Full name', 'Short name', ' '];
  fields: string[] = ['id', 'fullName', 'shortName'];
  private dataSource: MatTableDataSource<Subject>;
  private filter: EntityFilter;

  constructor(
    private http: SubjectRestService,
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
      fullName: '',
      shortName: ''
    };
    this.isFilterDefault = true;
    this.getSubjectList();
  }

  getSubjectList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Subject>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Subject>(entityPage.entityList);
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

    if (this.filter.fullName) {
      filter += '&fullName=' + this.filter.fullName;
    }

    if (this.filter.shortName) {
      filter += '&shortName=' + this.filter.shortName;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Subject',
      editorMode: 'create'
    };

    this.dialog.open(SubjectEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getSubjectList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (subject: Subject) => {
        if (subject) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Subject',
            editorMode: 'edit',
            entity: subject
          };

          this.dialog.open(SubjectEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getSubjectList();
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
          this.getSubjectList();
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
    this.getSubjectList();
  }

  openFilter() {
    this.dialog.open(SubjectFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getSubjectList();
        }
      }
    );
  }

}
