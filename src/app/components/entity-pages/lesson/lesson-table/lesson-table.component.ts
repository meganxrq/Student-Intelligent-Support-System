import {Component, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource, PageEvent} from '@angular/material';
import {Lesson} from '../../../../models/entities/lesson';
import {LessonRestService} from '../../../../services/rest-services/entities/lesson-rest.service';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {LessonEditorComponent} from '../lesson-editor/lesson-editor.component';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {get} from 'lodash';
import {EntityPage} from '../../../../models/entity-page';
import {EntityFilter} from '../../../../models/entity-filter';
import {LessonFilterComponent} from '../lesson-filter/lesson-filter.component';
import {DateTimeFormatterService} from '../../../../services/date-time-formatter.service';

@Component({
  selector: 'app-lesson-table',
  templateUrl: './lesson-table.component.html',
  styleUrls: ['./lesson-table.component.less']
})
export class LessonTableComponent implements OnInit {

  private allRowsCount = -1;
  private currentPagination = '&page=0&size=10';
  private showTable = false;
  private isFilterDefault: boolean;
  private columns: string[] = ['ID', 'Department', 'Professor', 'Subject', 'Student group count', 'Lesson type', 'Testing type', 'Start date', 'End date', 'Hour count', ' '];
  fields: string[] = ['id', 'professor.department.name', 'professor.lastName', 'subject.shortName', 'studentGroup.length', 'lessonType.type', 'testingType.type', 'startDate', 'endDate', 'hourCount'];
  private orderByList: string[] = ['ID', 'Department', 'Professor', 'Subject', 'Lesson type', 'Testing type', 'Start date', 'End date', 'Hour count'];
  private dataSource: MatTableDataSource<Lesson>;
  private filter: EntityFilter;

  constructor(
    private http: LessonRestService,
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
      department: undefined,
      professor: undefined,
      subject: undefined,
      studentGroup: undefined,
      testingType: undefined,
      lessonType: undefined,
      startDate: '',
      endDate: '',
      hourCount: 0
    };
    this.isFilterDefault = true;
    this.getLessonList();
  }

  getLessonList() {
    this.http.getPage(this.makeFilterForHttp()).subscribe(
      (entityPage: EntityPage<Lesson>) => {
        this.allRowsCount = entityPage.totalEntityCount;
        this.dataSource = new MatTableDataSource<Lesson>(entityPage.entityList);
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

    if (this.filter.department) {
      filter += '&deptId=' + this.filter.department.id;
    }

    if (this.filter.professor) {
      filter += '&profId=' + this.filter.professor.id;
    }

    if (this.filter.subject) {
      filter += '&subjId=' + this.filter.subject.id;
    }

    if (this.filter.studentGroup) {
      filter += '&groupId=' + this.filter.studentGroup.id;
      this.columns[4] = 'Student group';
      this.fields[4] = 'studentGroup[0].startYear';
    } else {
      this.columns[4] = 'Student group count';
      this.fields[4] = 'studentGroup.length';
    }

    if (this.filter.testingType) {
      filter += '&tTypeId=' + this.filter.testingType.id;
    }

    if (this.filter.lessonType) {
      filter += '&lTypeId=' + this.filter.lessonType.id;
    }

    if (this.filter.startDate) {
      filter += '&sDate=' + this.dateTimeFormatter.get_yyyy_MM_dd(this.filter.startDate);
    }

    if (this.filter.endDate) {
      filter += '&eDate=' + this.dateTimeFormatter.get_yyyy_MM_dd(this.filter.endDate);
    }

    if (this.filter.hourCount) {
      filter += '&hours=' + this.filter.hourCount;
    }

    return filter.concat(this.currentPagination);
  }

  getValue(object, path: string) {
    return get(object, path);
  }

  create() {
    const dialogData: SimpleEntityEditorData = {
      label: 'Create new Lesson',
      editorMode: 'create'
    };

    this.dialog.open(LessonEditorComponent,
      {
        data: dialogData
      }).afterClosed().subscribe(
      (refresh: boolean) => {
        if (refresh) {
          this.getLessonList();
        }
      }
    );
  }

  edit(id: number) {
    this.http.getById(id).subscribe(
      (lesson: Lesson) => {
        if (lesson) {
          const dialogData: SimpleEntityEditorData = {
            label: 'Edit the Lesson',
            editorMode: 'edit',
            entity: lesson
          };

          this.dialog.open(LessonEditorComponent,
            {
              data: dialogData
            }).afterClosed().subscribe(
            (refresh: boolean) => {
              if (refresh) {
                this.getLessonList();
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
          this.getLessonList();
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
    this.getLessonList();
  }

  openFilter() {
    this.dialog.open(LessonFilterComponent,
      {
        data: Object.assign({}, this.filter)
      }).afterClosed().subscribe(
      (filter: EntityFilter) => {
        if (filter) {
          if (JSON.stringify(this.filter) !== JSON.stringify(filter)) {
            this.filter = filter;
            this.isFilterDefault = false;
          }
          this.getLessonList();
        }
      }
    );
  }

}
