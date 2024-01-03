import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DepartmentRestService} from '../../../../services/rest-services/entities/department-rest.service';
import {Department} from '../../../../models/entities/department';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {Faculty} from '../../../../models/entities/faculty';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {ServerResponse} from '../../../../constants/const';

@Component({
  selector: 'app-department-editor',
  templateUrl: './department-editor.component.html',
  styleUrls: ['./department-editor.component.less']
})
export class DepartmentEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyList: Faculty[];

  constructor(
    private dialogRef: MatDialogRef<DepartmentEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private departmentRest: DepartmentRestService,
    private facultyRest: FacultyRestService,
    private notification: SnackBarService
  ) {
    this.getFacultyList();
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        name: '',
        faculty: {}
      };
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

  save() {
    this.isSaveBtnDisabled = true;

    this.data.entity.name = this.data.entity.name.trim().replace(/\s\s+/g, ' ');

    for (const faculty of this.facultyList) {
      if (faculty.shortName === this.data.entity.faculty.shortName) {
        this.data.entity.faculty = faculty;
      }
    }

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.departmentRest.update(this.data.entity).subscribe(
        (department: Department) => {
          if (department) {
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
      this.departmentRest.create(this.data.entity).subscribe(
        (department: Department) => {
          if (department) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Department has ID = ' + department.id);
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
      this.data.entity.name.trim() === ''
      || !this.data.entity.faculty.shortName;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
