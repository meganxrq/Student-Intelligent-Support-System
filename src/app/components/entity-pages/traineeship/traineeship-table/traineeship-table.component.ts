import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Traineeship} from '../../../../models/entities/traineeship';
import {TraineeshipRestService} from '../../../../services/rest-services/entities/traineeship-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {TraineeshipEditorComponent} from '../traineeship-editor/traineeship-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {DateTimeFormatterService} from '../../../../services/date-time-formatter.service';
import {TraineeshipFilterComponent} from '../traineeship-filter/traineeship-filter.component';

@Component({
  selector: 'app-traineeship-table',
  templateUrl: './traineeship-table.component.html',
  styleUrls: ['./traineeship-table.component.less']
})
export class TraineeshipTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Type', 'Student group count', 'Start date', 'End date', 'Professor', ' '];
  fields: string[] = ['id', 'traineeshipType.type', 'studentGroup.length', 'startDate', 'endDate', 'professor.lastName'];
  private orderByList: string[] = ['ID', 'Type', 'Start date', 'End date', 'Professor'];
  private dataSource: MatTableDataSource<Traineeship>;
  private filter: EntityFilter;

  constructor(
    private http: TraineeshipRestService,
    private dialog: MatDialog,
    private notification: SnackBarService,
    private dateTimeFormatter: DateTimeFormatterService
  ) {
    this.resetFilter();
  }

  ngOnInit() {
  }

  resetFilter() {
    this.filter = {
      orderByList: this.orderByList,
      orderBy: this.orderByList[0],
      isAscending: true,
      faculty: undefined,
      department: undefined,
      professor: undefined,
      studentGroup: undefined,
      traineeshipType: undefined,
      startDate: '',
      endDate: ''
    };
    this.isFilterDefault = true;
    this.getTraineeshipList();
  }

  getTraineeshipList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Traineeship>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Traineeship>(entityPage.entityList);
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

    if (this.filter.studentGroup) {
      filter += '&groupId=' + this.filter.studentGroup.id;
      this.columns[2] = 'Student group';
      this.fields[2] = 'studentGroup[0].startYear';
    } else {
      this.columns[2] = 'Student group count';
      this.fields[2] = 'studentGroup.length';
    }

    if (this.filter.traineeshipType) {
      filter += '&tTypeId=' + this.filter.traineeshipType.id;
    }

    if (this.filter.startDate) {
      filter += '&sDate=' + this.dateTimeFormatter.get_yyyy_MM_dd(this.filter.startDate);
    }

    if (this.filter.endDate) {
      filter += '&eDate=' + this.dateTimeFormatter.get_yyyy_MM_dd(this.filter.endDate);
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Traineeship',
      editorMode: 'create'
    };

    this.dialog.open(TraineeshipEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getTraineeshipList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (traineeship: Traineeship) => {
        if (traineeship) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Traineeship',
            editorMode: 'edit',
            entity: traineeship
          };

          this.dialog.open(TraineeshipEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getTraineeshipList();
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
          this.getTraineeshipList();
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
    this.getTraineeshipList();
  }

  openFilter() {
    this.dialog.open(TraineeshipFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getTraineeshipList();
        }
      }
    );
  }

}
