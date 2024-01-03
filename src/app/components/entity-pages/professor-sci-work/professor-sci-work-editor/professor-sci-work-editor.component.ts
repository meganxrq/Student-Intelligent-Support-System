import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProfessorSciWorkRestService} from '../../../../services/rest-services/entities/professor-sci-work-rest.service';
import {ProfessorSciWork} from '../../../../models/entities/professor-sci-work';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {PASS_STATUS, ServerResponse} from '../../../../constants/const';
import {Faculty} from '../../../../models/entities/faculty';
import {Department} from '../../../../models/entities/department';
import {Professor} from '../../../../models/entities/professor';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {Type} from '../../../../models/entities/type';
import {ProfessorSciWorkTypeRestService} from '../../../../services/rest-services/entities/professor-sci-work-type-rest.service';
import {DateTimeFormatterService} from '../../../../services/date-time-formatter.service';

@Component({
  selector: 'app-professor-sci-work-editor',
  templateUrl: './professor-sci-work-editor.component.html',
  styleUrls: ['./professor-sci-work-editor.component.less']
})
export class ProfessorSciWorkEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyShortName: string;
  private facultyList: Faculty[];
  private departmentName: string;
  private departmentList: Department[];
  private professorList: Professor[];
  private defenseStatusList = PASS_STATUS;
  private professorSciWorkTypeList: Type[];

  constructor(
    private dialogRef: MatDialogRef<ProfessorSciWorkEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private professorSciWorkRest: ProfessorSciWorkRestService,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private professorRest: ProfessorRestService,
    private professorSciWorkTypeRest: ProfessorSciWorkTypeRestService,
    private notification: SnackBarService,
    private dateTimeFormatter: DateTimeFormatterService
  ) {
    this.getFacultyList();
    this.getProfSciWorkTypeList();
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        professorSciWorkType: {},
        topic: '',
        professor: {}
      };
    } else {
      this.facultyShortName = this.data.entity.professor.department.faculty.shortName;
      this.departmentName = this.data.entity.professor.department.name;
      this.getDepartmentList();
      this.getProfessorList();
    }
  }

  getFacultyList() {
    this.facultyRest.getAll().subscribe(
      (facultyList: Faculty[]) => {
        this.facultyList = facultyList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getDepartmentList(isReset?: boolean) {
    if (isReset) {
      this.departmentName = undefined;
      this.data.entity.professor = {};
    }
    this.departmentRest.getAll(this.facultyShortName).subscribe(
      (departmentList: Department[]) => {
        this.departmentList = departmentList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getProfessorList() {
    this.professorRest.getAll(this.departmentName).subscribe(
      (professorList: Professor[]) => {
        this.professorList = professorList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getProfSciWorkTypeList() {
    this.professorSciWorkTypeRest.getAll().subscribe(
      (professorSciWorkTypeList: Type[]) => {
        this.professorSciWorkTypeList = professorSciWorkTypeList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.topic = this.data.entity.topic.trim().replace(/\s\s+/g, ' ');
    this.data.entity.defenseDate = this.dateTimeFormatter.get_yyyy_MM_dd(this.data.entity.defenseDate);

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.professorSciWorkRest.update(this.data.entity).subscribe(
        (professorSciWork: ProfessorSciWork) => {
          if (professorSciWork) {
            this.dialogRef.close({refresh: true});
            this.notify(ServerResponse.SUCCESS);
          } else {
            this.notify(ServerResponse.NO_SUCH_RECORD);
          }
        },
        error => {
          this.notify(ServerResponse.NO_RESPONSE);
        }
      );
    } else if (this.data.editorMode.toLowerCase() === 'create') {
      this.professorSciWorkRest.create(this.data.entity).subscribe(
        (professorSciWork: ProfessorSciWork) => {
          if (professorSciWork) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New ProfessorSciWork has ID = ' + professorSciWork.id);
          } else {
            this.notify(ServerResponse.RECORD_ALREADY_EXISTS);
          }
        },
        error => {
          this.notify(ServerResponse.NO_RESPONSE);
        }
      );
    }
  }

  compareProfessor(p1: Professor, p2: Professor) {
    return p1.id === p2.id;
  }

  compareProfSciWorkType(pswt1: Type, pswt2: Type) {
    return pswt1.id === pswt2.id;
  }

  clearDate() {
    this.data.entity.defenseDate = undefined;
  }

  disableSaveBtn(): boolean {
    return this.isSaveBtnDisabled
      || !this.data.entity.professor
      || !this.data.entity.professorSciWorkType
      || !this.data.entity.topic
      || (this.data.entity.defenseStatus && !this.data.entity.defenseDate)
      || (!this.data.entity.defenseStatus && this.data.entity.defenseDate);
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
