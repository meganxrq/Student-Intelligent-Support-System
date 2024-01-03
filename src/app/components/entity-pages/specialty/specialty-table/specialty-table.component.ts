import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Specialty} from '../../../../models/entities/specialty';
import {SpecialtyRestService} from '../../../../services/rest-services/entities/specialty-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';

import {SpecialtyEditorComponent} from '../specialty-editor/specialty-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {SpecialtyFilterComponent} from '../specialty-filter/specialty-filter.component';

@Component({
  selector: 'app-specialty-table',
  templateUrl: './specialty-table.component.html',
  styleUrls: ['./specialty-table.component.less']
})
export class SpecialtyTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['Code', 'Name', 'Faculty', 'Program', 'Duration (years)', ' '];
  fields: string[] = ['code', 'name', 'faculty.shortName', 'program', 'duration'];
  private dataSource: MatTableDataSource<Specialty>;
  private filter: EntityFilter;

  constructor(
    private http: SpecialtyRestService,
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
      code: '',
      name: '',
      faculty: undefined,
      program: '',
      duration: 0
    };
    this.isFilterDefault = true;
    this.getSpecialtyList();
  }

  getSpecialtyList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Specialty>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Specialty>(entityPage.entityList);
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

    if (this.filter.code) {
      filter += '&code=' + this.filter.code;
    }

    if (this.filter.name) {
      filter += '&name=' + this.filter.name;
    }

    if (this.filter.faculty) {
      filter += '&facultyId=' + this.filter.faculty.id;
    }

    if (this.filter.program) {
      filter += '&program=' + this.filter.program;
    }

    if (this.filter.duration) {
      filter += '&duration=' + this.filter.duration;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Specialty',
      editorMode: 'create'
    };

    this.dialog.open(SpecialtyEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getSpecialtyList();
        }
      }
    );
  }

  edit(code: string) {
    this.http.getByCode(code).subscribe(
      (specialty: Specialty) => {
        if (specialty) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Specialty',
            editorMode: 'edit',
            entity: specialty
          };

          this.dialog.open(SpecialtyEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getSpecialtyList();
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

  delete(code: string) {
    this.http.deleteByCodes([code]).subscribe(
      (deleteCount: number) => {
        if (deleteCount === 1) {
          this.notification.open(ServerResponse.SUCCESS);
          this.getSpecialtyList();
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
    this.getSpecialtyList();
  }

  openFilter() {
    this.dialog.open(SpecialtyFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getSpecialtyList();
        }
      }
    );
  }

}
