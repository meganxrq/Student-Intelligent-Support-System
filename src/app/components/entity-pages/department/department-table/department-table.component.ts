import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Department} from '../../../../models/entities/department';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {DepartmentEditorComponent} from '../department-editor/department-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {DepartmentFilterComponent} from '../department-filter/department-filter.component';

@Component({
  selector: 'app-department-table',
  templateUrl: './department-table.component.html',
  styleUrls: ['./department-table.component.less']
})
export class DepartmentTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Name', 'Faculty', ' '];
  fields: string[] = ['id', 'name', 'faculty.shortName'];
  private dataSource: MatTableDataSource<Department>;
  private filter: EntityFilter;

  constructor(
    private http: DepartmentRestService,
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
      name: '',
      faculty: undefined
    };
    this.isFilterDefault = true;
    this.getDepartmentList();
  }

  getDepartmentList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Department>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Department>(entityPage.entityList);
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

    if (this.filter.faculty) {
      filter += '&facultyId=' + this.filter.faculty.id;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Department',
      editorMode: 'create'
    };

    this.dialog.open(DepartmentEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getDepartmentList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (department: Department) => {
        if (department) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Department',
            editorMode: 'edit',
            entity: department
          };

          this.dialog.open(DepartmentEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getDepartmentList();
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
          this.getDepartmentList();
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
    this.getDepartmentList();
  }

  openFilter() {
    this.dialog.open(DepartmentFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getDepartmentList();
        }
      }
    );
  }

}
