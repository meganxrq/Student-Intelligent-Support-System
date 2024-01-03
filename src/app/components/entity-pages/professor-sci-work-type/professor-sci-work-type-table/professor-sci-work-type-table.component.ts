import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Type} from '../../../../models/entities/type';
import {ProfessorSciWorkTypeRestService} from '../../../../services/rest-services/entities/professor-sci-work-type-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {ProfessorSciWorkTypeEditorComponent} from '../professor-sci-work-type-editor/professor-sci-work-type-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {ProfessorSciWorkTypeFilterComponent} from '../professor-sci-work-type-filter/professor-sci-work-type-filter.component';

@Component({
  selector: 'app-professor-sci-work-type-table',
  templateUrl: './professor-sci-work-type-table.component.html',
  styleUrls: ['./professor-sci-work-type-table.component.less']
})
export class ProfessorSciWorkTypeTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Type', ' '];
  fields: string[] = ['id', 'type'];
  private dataSource: MatTableDataSource<Type>;
  private filter: EntityFilter;

  constructor(
    private http: ProfessorSciWorkTypeRestService,
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
      isAscending: true
    };
    this.isFilterDefault = true;
    this.getProfessorSciWorkTypeList();
  }

  getProfessorSciWorkTypeList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Type>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Type>(entityPage.entityList);
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
      '&isAscending=' + this.filter.isAscending;

    if (this.filter.type) {
      filter += '&type=' + this.filter.type;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Type',
      editorMode: 'create'
    };

    this.dialog.open(ProfessorSciWorkTypeEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getProfessorSciWorkTypeList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (professorSciWorkType: Type) => {
        if (professorSciWorkType) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Type',
            editorMode: 'edit',
            entity: professorSciWorkType
          };

          this.dialog.open(ProfessorSciWorkTypeEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getProfessorSciWorkTypeList();
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
          this.getProfessorSciWorkTypeList();
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
    this.getProfessorSciWorkTypeList();
  }

  openFilter() {
    this.dialog.open(ProfessorSciWorkTypeFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getProfessorSciWorkTypeList();
        }
      }
    );
  }

}
