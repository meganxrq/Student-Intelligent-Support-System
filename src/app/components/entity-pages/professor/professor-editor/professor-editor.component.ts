import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProfessorRestService} from '../../../../services/rest-services/entities/professor-rest.service';
import {Professor} from '../../../../models/entities/professor';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {Department} from '../../../../models/entities/department';
import {ProfessorDegree} from '../../../../models/entities/professor-degree';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {ProfessorDegreeRestService} from '../../../../services/rest-services/entities/professor-degree-rest.service';
import {SEX} from '../../../../constants/const';
import {Faculty} from '../../../../models/entities/faculty';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';

@Component({
  selector: 'app-professor-editor',
  templateUrl: './professor-editor.component.html',
  styleUrls: ['./professor-editor.component.less']
})
export class ProfessorEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private sexList = SEX;
  private facultyShortName: string;
  private facultyList: Faculty[];
  private departmentList: Department[];
  private degreeList: ProfessorDegree[];

  constructor(
    private dialogRef: MatDialogRef<ProfessorEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private professorRest: ProfessorRestService,
    private notification: SnackBarService,
    private facultyRest: FacultyRestService,
    private departmentRest: DepartmentRestService,
    private degreeRest: ProfessorDegreeRestService
  ) {
    this.getFacultyList();
    this.getDegreeList(); // async request is ok here
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        sex: 'Male',
        firstName: '',
        lastName: '',
        department: {},
        degree: {}
      };
    } else {
      if (this.data.entity.department) {
        this.facultyShortName = this.data.entity.department.faculty.shortName;
        this.getDepartmentList();
      }
      this.professorRest.getCredentials(this.data.entity.id).subscribe(
        (credentials: string[]) => {
          this.data.entity.username = credentials[0];
          this.data.entity.password = credentials[1];
        },
        error => {
          this.notification.open('Error! Could not load user\'s credentials');
        }
      );
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

  getDepartmentList() {
    // reset previously chosen department
    this.data.entity.department.name = undefined;
    this.departmentRest.getAll(this.facultyShortName).subscribe(
      (departmentList: Department[]) => {
        this.departmentList = departmentList;
        if (this.data.entity.department) {
          for (const department of this.departmentList) {
            if (department.id === this.data.entity.department.id) {
              this.data.entity.department = department;
            }
          }
        }
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getDegreeList() {
    this.degreeRest.getAll().subscribe(
      (degreeList: ProfessorDegree[]) => {
        this.degreeList = degreeList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.firstName = this.data.entity.firstName.trim().replace(/\s\s+/g, ' ');
    this.data.entity.lastName = this.data.entity.lastName.trim().replace(/\s\s+/g, ' ');

    for (const department of this.departmentList) {
      if (department.name === this.data.entity.department.name) {
        this.data.entity.department = department;
      }
    }

    for (const degree of this.degreeList) {
      if (degree.name === this.data.entity.degree.name) {
        this.data.entity.degree = degree;
      }
    }

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.professorRest.update(this.data.entity).subscribe(
        (professor: Professor) => {
          if (professor) {
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
      this.professorRest.create(this.data.entity).subscribe(
        (professor: Professor) => {
          if (professor) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Professor has ID = ' + professor.id);
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

  disableSaveBtn(): boolean {
    return this.isSaveBtnDisabled ||
      this.data.entity.firstName.trim() === ''
      || this.data.entity.lastName.trim() === ''
      || !this.data.entity.department.name
      || !this.data.entity.degree.name;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
