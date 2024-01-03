import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {ProfessorSciWork} from '../../../../models/entities/professor-sci-work';
import {ProfessorSciWorkRestService} from '../../../../services/rest-services/entities/professor-sci-work-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';

import {ProfessorSciWorkEditorComponent} from '../professor-sci-work-editor/professor-sci-work-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {ProfessorSciWorkFilterComponent} from '../professor-sci-work-filter/professor-sci-work-filter.component';
import {DateTimeFormatterService} from '../../../../services/date-time-formatter.service';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-professor-sci-work-table',
  templateUrl: './professor-sci-work-table.component.html',
  styleUrls: ['./professor-sci-work-table.component.less']
})
export class ProfessorSciWorkTableComponent implements OnInit {

  private defaultColumns: string[] = ['ID', 'Last name', 'First name', 'Faculty', 'Department', 'Type', 'Topic', 'Defense status', 'Defense date', ' '];
  private defaultFields: string[] = ['id', 'professor.lastName', 'professor.firstName', 'professor.department.faculty.shortName', 'professor.department.name', 'professorSciWorkType.type', 'topic', 'defenseStatus', 'defenseDate'];
  private defaultOrderByList: string[] = this.defaultColumns.slice(0, this.defaultColumns.length - 1);

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[];
  private fields: string[];
  private orderByList: string[];
  private dataSource: MatTableDataSource<ProfessorSciWork>;
  private filter: EntityFilter;

  constructor(
    private http: ProfessorSciWorkRestService,
    private dialog: MatDialog,
    private notification: SnackBarService,
    private dateTimeFormatter: DateTimeFormatterService,
    private userService: UserService
  ) {
    if (!this.userService.isAdmin()) {
      // either student or professor
      this.defaultColumns.shift();
      this.defaultFields.shift();
      this.defaultOrderByList.shift();
    }
    this.columns = this.defaultColumns;
    this.fields = this.defaultFields;
    this.orderByList = this.defaultOrderByList;
    this.resetFilter();
  }

  ngOnInit() {
  }

  resetFilter() {
    this.filter = {
      orderByList: this.columns.slice(0, this.columns.length - 1),
      orderBy: this.columns[0],
      isAscending: true,
      faculty: undefined,
      department: undefined,
      professor: undefined,
      professorSciWorkType: undefined,
      topic: '',
      defenseStatus: '',
      defenseDate: ''
    };

    this.isFilterDefault = true;
    this.getProfessorSciWorkList();
  }

  getProfessorSciWorkList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<ProfessorSciWork>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<ProfessorSciWork>(entityPage.entityList);
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

    if (this.filter.faculty) {
      filter += '&facultyId=' + this.filter.faculty.id;
    }

    if (this.filter.department) {
      filter += '&deptId=' + this.filter.department.id;
    }

    if (this.filter.professor) {
      filter += '&profId=' + this.filter.professor.id;
    }

    if (this.filter.professorSciWorkType) {
      filter += '&workTypeId=' + this.filter.professorSciWorkType.id;
    }

    if (this.filter.topic) {
      filter += '&topic=' + this.filter.topic;
    }

    if (this.filter.defenseStatus) {
      filter += '&status=' + this.filter.defenseStatus;
    }

    if (this.filter.defenseDate) {
      filter += '&date=' + this.dateTimeFormatter.get_yyyy_MM_dd(this.filter.defenseDate);
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new ProfessorSciWork',
      editorMode: 'create'
    };

    this.dialog.open(ProfessorSciWorkEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getProfessorSciWorkList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (professorSciWork: ProfessorSciWork) => {
        if (professorSciWork) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the ProfessorSciWork',
            editorMode: 'edit',
            entity: professorSciWork
          };

          this.dialog.open(ProfessorSciWorkEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getProfessorSciWorkList();
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
          this.getProfessorSciWorkList();
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
    this.getProfessorSciWorkList();
  }

  openFilter() {
    this.dialog.open(ProfessorSciWorkFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getProfessorSciWorkList();
        }
      }
    );
  }

}
