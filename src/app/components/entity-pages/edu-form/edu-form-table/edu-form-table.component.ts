import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {EduForm} from '../../../../models/entities/edu-form';
import {EduFormRestService} from '../../../../services/rest-services/entities/edu-form-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {EduFormEditorComponent} from '../edu-form-editor/edu-form-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {EduFormFilterComponent} from '../edu-form-filter/edu-form-filter.component';

@Component({
  selector: 'app-edu-form-table',
  templateUrl: './edu-form-table.component.html',
  styleUrls: ['./edu-form-table.component.less']
})
export class EduFormTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Name', ' '];
  fields: string[] = ['id', 'name'];
  private dataSource: MatTableDataSource<EduForm>;
  private filter: EntityFilter;

  constructor(
    private http: EduFormRestService,
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
    this.getEduFormList();
  }

  getEduFormList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<EduForm>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<EduForm>(entityPage.entityList);
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
      label: 'Create new EduForm',
      editorMode: 'create'
    };

    this.dialog.open(EduFormEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getEduFormList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (eduForm: EduForm) => {
        if (eduForm) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the EduForm',
            editorMode: 'edit',
            entity: eduForm
          };

          this.dialog.open(EduFormEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getEduFormList();
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
          this.getEduFormList();
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
    this.getEduFormList();
  }

  openFilter() {
    this.dialog.open(EduFormFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getEduFormList();
        }
      }
    );
  }

}
