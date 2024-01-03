import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Faculty} from '../../../../models/entities/faculty';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {FacultyEditorComponent} from '../faculty-editor/faculty-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {FacultyFilterComponent} from '../faculty-filter/faculty-filter.component';

@Component({
  selector: 'app-faculty-table',
  templateUrl: './faculty-table.component.html',
  styleUrls: ['./faculty-table.component.less']
})
export class FacultyTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Full name', 'Short name', ' '];
  fields: string[] = ['id', 'fullName', 'shortName'];
  private dataSource: MatTableDataSource<Faculty>;
  private filter: EntityFilter;

  constructor(
    private http: FacultyRestService,
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
    this.getFacultyList();
  }

  getFacultyList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Faculty>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Faculty>(entityPage.entityList);
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
      label: 'Create new Faculty',
      editorMode: 'create'
    };

    this.dialog.open(FacultyEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getFacultyList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (faculty: Faculty) => {
        if (faculty) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Faculty',
            editorMode: 'edit',
            entity: faculty
          };

          this.dialog.open(FacultyEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getFacultyList();
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
          this.getFacultyList();
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
    this.getFacultyList();
  }

  openFilter() {
    this.dialog.open(FacultyFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getFacultyList();
        }
      }
    );
  }

}
