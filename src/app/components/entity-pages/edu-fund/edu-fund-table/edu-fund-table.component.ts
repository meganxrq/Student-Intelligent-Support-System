import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {EduFund} from '../../../../models/entities/edu-fund';
import {EduFundRestService} from '../../../../services/rest-services/entities/edu-fund-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {EduFundEditorComponent} from '../edu-fund-editor/edu-fund-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {EduFundFilterComponent} from '../edu-fund-filter/edu-fund-filter.component';

@Component({
  selector: 'app-edu-fund-table',
  templateUrl: './edu-fund-table.component.html',
  styleUrls: ['./edu-fund-table.component.less']
})
export class EduFundTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Name', ' '];
  fields: string[] = ['id', 'name'];
  private dataSource: MatTableDataSource<EduFund>;
  private filter: EntityFilter;

  constructor(
    private http: EduFundRestService,
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
      name: ''
    };
    this.isFilterDefault = true;
    this.getEduFundList();
  }

  getEduFundList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<EduFund>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<EduFund>(entityPage.entityList);
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

    if (this.filter.name) {
      filter += '&name=' + this.filter.name;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new EduFund',
      editorMode: 'create'
    };

    this.dialog.open(EduFundEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getEduFundList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (eduFund: EduFund) => {
        if (eduFund) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the EduFund',
            editorMode: 'edit',
            entity: eduFund
          };

          this.dialog.open(EduFundEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getEduFundList();
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
          this.getEduFundList();
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
    this.getEduFundList();
  }

  openFilter() {
    this.dialog.open(EduFundFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getEduFundList();
        }
      }
    );
  }

}
