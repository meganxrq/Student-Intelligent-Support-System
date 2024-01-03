import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {SpecialtyRestService} from '../../../../services/rest-services/entities/specialty-rest.service';
import {Specialty} from '../../../../models/entities/specialty';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {PROGRAM_LIST, ServerResponse} from '../../../../constants/const';
import {Faculty} from '../../../../models/entities/faculty';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';

@Component({
  selector: 'app-specialty-editor',
  templateUrl: './specialty-editor.component.html',
  styleUrls: ['./specialty-editor.component.less']
})
export class SpecialtyEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private facultyList: Faculty[];
  private programList = PROGRAM_LIST;

  constructor(
    private dialogRef: MatDialogRef<SpecialtyEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private specialtyRest: SpecialtyRestService,
    private facultyRest: FacultyRestService,
    private notification: SnackBarService
  ) {
    this.getFacultyList();
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        code: '',
        name: '',
        faculty: {},
        program: '',
        duration: 0
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

    this.data.entity.code = this.data.entity.code.trim().replace(/\s\s+/g, ' ');
    this.data.entity.name = this.data.entity.name.trim().replace(/\s\s+/g, ' ');
    for (const faculty of this.facultyList) {
      if (faculty.shortName === this.data.entity.faculty.shortName) {
        this.data.entity.faculty = faculty;
      }
    }

    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.specialtyRest.update(this.data.entity).subscribe(
        (specialty: Specialty) => {
          if (specialty) {
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
      this.specialtyRest.create(this.data.entity).subscribe(
        (specialty: Specialty) => {
          if (specialty) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Specialty has ID = ' + specialty.code);
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
      this.data.entity.code.trim() === ''
      || this.data.entity.name.trim() === ''
      || !this.data.entity.faculty.shortName
      || this.data.entity.program.trim() === ''
      || this.data.entity.duration < 1
      || this.data.entity.duration > 20;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
