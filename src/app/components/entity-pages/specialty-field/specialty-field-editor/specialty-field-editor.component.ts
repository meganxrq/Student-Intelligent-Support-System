import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SpecialtyFieldRestService} from '../../../../services/rest-services/entities/specialty-field-rest.service';
import {SpecialtyField} from '../../../../models/entities/specialty-field';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {Specialty} from '../../../../models/entities/specialty';
import {SpecialtyRestService} from '../../../../services/rest-services/entities/specialty-rest.service';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {Faculty} from '../../../../models/entities/faculty';

@Component({
  selector: 'app-specialty-field-editor',
  templateUrl: './specialty-field-editor.component.html',
  styleUrls: ['./specialty-field-editor.component.less']
})
export class SpecialtyFieldEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private specialtyList: Specialty[];
  private facultyList: Faculty[];
  private facultyShortName: string;

  constructor(
    private dialogRef: MatDialogRef<SpecialtyFieldEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private specialtyFieldRest: SpecialtyFieldRestService,
    private specialtyRest: SpecialtyRestService,
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
        specialty: {}
      };
    } else {
      this.facultyShortName = this.data.entity.specialty.faculty.shortName;
      this.getSpecialtyList();
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

  getSpecialtyList(isReset?: boolean) {
    if (isReset) {
      this.data.entity.specialty = {};
    }
    this.specialtyRest.getAll(this.facultyShortName).subscribe(
      (specialtyList: Specialty[]) => {
        this.specialtyList = specialtyList;
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

    for (const specialty of this.specialtyList) {
      if (specialty.name === this.data.entity.specialty.name) {
        this.data.entity.specialty = specialty;
      }
    }

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.specialtyFieldRest.update(this.data.entity).subscribe(
        (specialtyField: SpecialtyField) => {
          if (specialtyField) {
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
      this.specialtyFieldRest.create(this.data.entity).subscribe(
        (specialtyField: SpecialtyField) => {
          if (specialtyField) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New SpecialtyField has ID = ' + specialtyField.id);
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
      || !this.data.entity.specialty.name;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
