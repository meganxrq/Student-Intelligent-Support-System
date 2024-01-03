import {Component, Inject, OnInit} from '@angular/core';
import {SimpleEntityEditorData} from '../../../../models/simple-entity-editor-data';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {StudentRestService} from '../../../../services/rest-services/entities/student-rest.service';
import {Student} from '../../../../models/entities/student';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {ServerResponse, SEX} from '../../../../constants/const';
import {StudentGroup} from '../../../../models/entities/student-group';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {EduFund} from '../../../../models/entities/edu-fund';
import {Scholarship} from '../../../../models/entities/scholarship';
import {EduFundRestService} from '../../../../services/rest-services/entities/edu-fund-rest.service';
import {ScholarshipRestService} from '../../../../services/rest-services/entities/scholarship-rest.service';

@Component({
  selector: 'app-student-editor',
  templateUrl: './student-editor.component.html',
  styleUrls: ['./student-editor.component.less']
})
export class StudentEditorComponent implements OnInit {

  private isSaveBtnDisabled = false;
  private sexList = SEX;
  private studentGroupList: StudentGroup[];
  private eduFundList: EduFund[];
  private scholarshipList: Scholarship[];

  constructor(
    private dialogRef: MatDialogRef<StudentEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: SimpleEntityEditorData,
    private studentRest: StudentRestService,
    private studentGroupRest: StudentGroupRestService,
    private eduFundRest: EduFundRestService,
    private scholarshipRest: ScholarshipRestService,
    private notification: SnackBarService
  ) {
    this.getStudentGroupList();
    this.getEduFundList();
    this.getScholarshipList();
  }

  ngOnInit() {
    if (!this.data.entity) {
      this.data.entity = {
        id: 0,
        sex: 'Male',
        firstName: '',
        lastName: '',
        studentGroup: {},
        eduFund: {},
        scholarship: {}
      };
    } else {
      this.studentRest.getCredentials(this.data.entity.id).subscribe(
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

  getStudentGroupList() {
    this.studentGroupRest.getAll().subscribe(
      (studentGroupList: StudentGroup[]) => {
        this.studentGroupList = studentGroupList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getEduFundList() {
    this.eduFundRest.getAll().subscribe(
      (eduFundList: EduFund[]) => {
        this.eduFundList = eduFundList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  getScholarshipList() {
    this.scholarshipRest.getAll().subscribe(
      (scholarshipList: Scholarship[]) => {
        this.scholarshipList = scholarshipList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
  }

  save() {
    this.isSaveBtnDisabled = true;


    if (this.data.editorMode.toLowerCase() === 'edit') {
      this.studentRest.update(this.data.entity).subscribe(
        (student: Student) => {
          if (student) {
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
      this.studentRest.create(this.data.entity).subscribe(
        (student: Student) => {
          if (student) {
            this.dialogRef.close({refresh: true});
            this.notify('Success! New Student has ID = ' + student.id);
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

  compareStudentGroup(sg1: StudentGroup, sg2: StudentGroup) {
    return sg1.id === sg2.id;
  }

  compareEduFund(ef1: EduFund, ef2: EduFund) {
    return ef1.id === ef2.id;
  }

  compareScholarship(s1: Scholarship, s2: Scholarship) {
    return s1.id === s2.id;
  }

  disableSaveBtn(): boolean {
    return this.isSaveBtnDisabled ||
      this.data.entity.firstName.trim() === ''
      || this.data.entity.lastName.trim() === ''
      || !this.data.entity.studentGroup.startYear
      || !this.data.entity.eduFund.name
      || !this.data.entity.scholarship.type;
  }

  notify(message: string) {
    this.notification.open(message);
    this.isSaveBtnDisabled = false;
  }

}
