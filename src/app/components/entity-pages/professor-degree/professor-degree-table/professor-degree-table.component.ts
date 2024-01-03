import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {ProfessorDegree} from '../../../../models/entities/professor-degree';
import {ProfessorDegreeRestService} from '../../../../services/rest-services/entities/professor-degree-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';

import {ProfessorDegreeEditorComponent} from '../professor-degree-editor/professor-degree-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {ProfessorDegreeFilterComponent} from '../professor-degree-filter/professor-degree-filter.component';

@Component({
  selector: 'app-professor-degree-table',
  templateUrl: './professor-degree-table.component.html',
  styleUrls: ['./professor-degree-table.component.less']
})
export class ProfessorDegreeTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Name', ' '];
  fields: string[] = ['id', 'name'];
  private dataSource: MatTableDataSource<ProfessorDegree>;
  private filter: EntityFilter;

  constructor(
    private http: ProfessorDegreeRestService,
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
    this.getProfessorDegreeList();
  }

  getProfessorDegreeList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<ProfessorDegree>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<ProfessorDegree>(entityPage.entityList);
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
      label: 'Create new ProfessorDegree',
      editorMode: 'create'
    };

    this.dialog.open(ProfessorDegreeEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getProfessorDegreeList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (professorDegree: ProfessorDegree) => {
        if (professorDegree) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the ProfessorDegree',
            editorMode: 'edit',
            entity: professorDegree
          };

          this.dialog.open(ProfessorDegreeEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getProfessorDegreeList();
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
          this.getProfessorDegreeList();
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
    this.getProfessorDegreeList();
  }

  openFilter() {
    this.dialog.open(ProfessorDegreeFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getProfessorDegreeList();
        }
      }
    );
  }

}
