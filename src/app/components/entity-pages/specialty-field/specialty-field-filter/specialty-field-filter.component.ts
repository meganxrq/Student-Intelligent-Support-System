import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse} from '../../../../constants/const';
import {Specialty} from '../../../../models/entities/specialty';
import {SpecialtyRestService} from '../../../../services/rest-services/entities/specialty-rest.service';
import {Faculty} from '../../../../models/entities/faculty';
import {FacultyRestService} from '../../../../services/rest-services/entities/faculty-rest.service';

@Component({
  selector: 'app-specialty-field-filter',
  templateUrl: './specialty-field-filter.component.html',
  styleUrls: ['./specialty-field-filter.component.less']
})
export class SpecialtyFieldFilterComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private specialtyList: Specialty[];
  private facultyList: Faculty[];

  constructor(
    private dialogRef: MatDialogRef<SpecialtyFieldFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private specialtyRest: SpecialtyRestService,
    private facultyRest: FacultyRestService,
    private notification: SnackBarService
  ) {
    this.getFacultyList();
    if (this.filter.faculty) {
      this.getSpecialtyList();
    }
  }

  ngOnInit() {
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
      this.filter.specialty = undefined;
    }
    this.specialtyRest.getAll(this.filter.faculty.shortName).subscribe(
      (specialtyList: Specialty[]) => {
        this.specialtyList = specialtyList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  compareFaculty(f1: Faculty, f2: Faculty) {
    if (f1 && f2) {
      return f1.id === f2.id;
    }
  }

  compareSpecialty(s1: Specialty, s2: Specialty) {
    if (s1 && s2) {
      return s1.code === s2.code;
    }
  }

  save() {
    this.dialogRef.close(this.filter);
  }

  disableSaveBtn(): boolean {
    return this.filter.faculty && !this.filter.specialty;
  }

  getArrowLabel(): string {
    if (this.filter.isAscending) {
      return '↑';
    } else {
      return '↓';
    }
  }

  switchOrderMode() {
    this.filter.isAscending = !this.filter.isAscending;
  }

}
