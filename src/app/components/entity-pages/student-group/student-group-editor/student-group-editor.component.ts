import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {StudentGroup} from '../../../../models/entities/student-group';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {PROGRAM_LIST, ServerResponse} from '../../../../constants/const';
import {Faculty} from '../../../../models/entities/faculty';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';
import {Specialty} from '../../../../models/entities/specialty';
import {SpecialtyRestService} from '../../../../services/rest-services/entities/specialty-rest.service';
import {SpecialtyFieldRestService} from '../../../../services/rest-services/entities/specialty-field-rest.service';
import {SpecialtyField} from '../../../../models/entities/specialty-field';
import {EduForm} from '../../../../models/entities/edu-form';
import {EduFormRestService} from '../../../../services/rest-services/entities/edu-form-rest.service';

@Component({
  selector: 'app-student-group-editor',
  templateUrl: './student-group-editor.component.html',
  styleUrls: ['./student-group-editor.component.less']
})
export class StudentGroupEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyShortName: string;
  private specialtyCode: string;
  private facultyList: Faculty[];
  private specialtyList: Specialty[];
  private specialtyFieldList: SpecialtyField[];
  private eduFormList: EduForm[];

  constructor(
    private dialogRef: MatDialogRef<StudentGroupEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private studentGroupRest: StudentGroupRestService,
    private facultyRest: FacultyRestService,
    private specialtyRest: SpecialtyRestService,
    private specialtyFieldRest: SpecialtyFieldRestService,
    private eduFormRest: EduFormRestService,
    private notification: SnackBarService
  ) {
    this.getFacultyList();
    this.getEduFormList();
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        number: 0,
        specialtyField: {},
        eduForm: {},
        startYear: 0
      };
    } else {
      this.facultyShortName = this.data.entity.specialtyField.specialty.faculty.shortName;
      this.specialtyCode = this.data.entity.specialtyField.specialty.code;
      this.getSpecialtyList();
      this.getSpecialtyFieldList();
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

  getEduFormList() {
    this.eduFormRest.getAll().subscribe(
      (eduFormList: EduForm[]) => {
        this.eduFormList = eduFormList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getSpecialtyList(isReset?: boolean) {
    if (isReset) {
      this.specialtyCode = undefined;
      this.data.entity.specialtyField.name = undefined;
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

  getSpecialtyFieldList(isReset?: boolean) {
    if (isReset) {
      this.data.entity.specialtyField.name = undefined;
    }
    this.specialtyFieldRest.getAll(this.specialtyCode).subscribe(
      (specialtyFieldList: SpecialtyField[]) => {
        this.specialtyFieldList = specialtyFieldList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  save() {
    this.isSaveBtnDisabled = true;

    for (const specialtyField of this.specialtyFieldList) {
      if (specialtyField.name === this.data.entity.specialtyField.name) {
        this.data.entity.specialtyField = specialtyField;
      }
    }

    for (const eduForm of this.eduFormList) {
      if (eduForm.name === this.data.entity.eduForm.name) {
        this.data.entity.eduForm = eduForm;
      }
    }

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.studentGroupRest.update(this.data.entity).subscribe(
        (studentGroup: StudentGroup) => {
          if (studentGroup) {
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
      this.studentGroupRest.create(this.data.entity).subscribe(
        (studentGroup: StudentGroup) => {
          if (studentGroup) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New StudentGroup has ID = ' + studentGroup.id);
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
    return this.isSaveBtnDisabled
      || this.data.entity.startYear < 1999
      || this.data.entity.startYear > 2100
      || !this.data.entity.specialtyField.name
      || !this.data.entity.eduForm.name
      || this.data.entity.number < 1
      || this.data.entity.number > 50;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
