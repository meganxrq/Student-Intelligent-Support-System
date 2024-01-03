import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Scholarship} from '../../../../models/entities/scholarship';
import {ScholarshipRestService} from '../../../../services/rest-services/entities/scholarship-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';

import {ScholarshipEditorComponent} from '../scholarship-editor/scholarship-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {ScholarshipFilterComponent} from '../scholarship-filter/scholarship-filter.component';

@Component({
  selector: 'app-scholarship-table',
  templateUrl: './scholarship-table.component.html',
  styleUrls: ['./scholarship-table.component.less']
})
export class ScholarshipTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Type', 'Amount ($)', ' '];
  fields: string[] = ['id', 'type', 'amount'];
  private dataSource: MatTableDataSource<Scholarship>;
  private filter: EntityFilter;

  constructor(
    private http: ScholarshipRestService,
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
      type: '',
      amount: ''
    };
    this.isFilterDefault = true;
    this.getScholarshipList();
  }

  getScholarshipList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Scholarship>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Scholarship>(entityPage.entityList);
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

    if (this.filter.type) {
      filter += '&type=' + this.filter.type;
    }

    if (this.filter.amount) {
      filter += '&amount=' + this.filter.amount;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Scholarship',
      editorMode: 'create'
    };

    this.dialog.open(ScholarshipEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getScholarshipList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (scholarship: Scholarship) => {
        if (scholarship) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Scholarship',
            editorMode: 'edit',
            entity: scholarship
          };

          this.dialog.open(ScholarshipEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getScholarshipList();
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
          this.getScholarshipList();
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
    this.getScholarshipList();
  }

  openFilter() {
    this.dialog.open(ScholarshipFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getScholarshipList();
        }
      }
    );
  }

}
