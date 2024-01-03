import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {SpecialtyField} from '../../../../models/entities/specialty-field';
import {SpecialtyFieldRestService} from '../../../../services/rest-services/entities/specialty-field-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {SpecialtyFieldEditorComponent} from '../specialty-field-editor/specialty-field-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {SpecialtyFieldFilterComponent} from '../specialty-field-filter/specialty-field-filter.component';

@Component({
  selector: 'app-specialty-field-table',
  templateUrl: './specialty-field-table.component.html',
  styleUrls: ['./specialty-field-table.component.less']
})
export class SpecialtyFieldTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Name', 'Specialty', ' '];
  fields: string[] = ['id', 'name', 'specialty.name'];
  private dataSource: MatTableDataSource<SpecialtyField>;
  private filter: EntityFilter;

  constructor(
    private http: SpecialtyFieldRestService,
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
      faculty: undefined,
      specialty: undefined
    };
    this.isFilterDefault = true;
    this.getSpecialtyFieldList();
  }

  getSpecialtyFieldList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<SpecialtyField>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<SpecialtyField>(entityPage.entityList);
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

    if (this.filter.specialty) {
      filter += '&sCode=' + this.filter.specialty.code;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new SpecialtyField',
      editorMode: 'create'
    };

    this.dialog.open(SpecialtyFieldEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getSpecialtyFieldList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (specialtyField: SpecialtyField) => {
        if (specialtyField) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the SpecialtyField',
            editorMode: 'edit',
            entity: specialtyField
          };

          this.dialog.open(SpecialtyFieldEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getSpecialtyFieldList();
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
          this.getSpecialtyFieldList();
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
    this.getSpecialtyFieldList();
  }

  openFilter() {
    this.dialog.open(SpecialtyFieldFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getSpecialtyFieldList();
        }
      }
    );
  }

}
