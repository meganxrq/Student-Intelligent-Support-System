import {Component, Inject, OnInit} from '@angular/core';
import {PASS_STATUS, ServerResponse} from '../../../../constants/const';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {EntityFilter} from '../../../../models/entity-filter';
import {SnackBarService} from '../../../../services/snack-bar.service';
import {StudentGroup} from '../../../../models/entities/student-group';
import {Student} from '../../../../models/entities/student';
import {StudentRestService} from '../../../../services/rest-services/entities/student-rest.service';
import {StudentGroupRestService} from '../../../../services/rest-services/entities/student-group-rest.service';
import {Professor} from '../../../../models/entities/professor';
import {Traineeship} from '../../../../models/entities/traineeship';
import {TraineeshipRestService} from '../../../../services/rest-services/entities/traineeship-rest.service';

@Component({
  selector: 'app-traineeship-progress-filter',
  templateUrl: './traineeship-progress-filter.component.html',
  styleUrls: ['./traineeship-progress-filter.component.less']
})
export class TraineeshipProgressFilterComponent implements OnInit {

  private studentGroupList: StudentGroup[];
  private studentList: Student[];
  private professorList: Professor[] = [];
  private traineeshipList: Traineeship[] = [];
  private passStatusList = PASS_STATUS;

  constructor(
    private dialogRef: MatDialogRef<TraineeshipProgressFilterComponent>,
    @Inject(MAT_DIALOG_DATA) private filter: EntityFilter,
    private studentGroupRest: StudentGroupRestService,
    private studentRest: StudentRestService,
    private traineeshipRest: TraineeshipRestService,
    private notification: SnackBarService
  ) {
    if (this.filter.showGroup) { // admin - professor mode
      if (this.filter.showProfessor) { // admin mode
        this.getStudentGroupList();
      } else { // professor mode
        this.getStudentGroupList(this.filter.professor.id);
      }
    } else { // student mode

    }
    if (this.filter.studentGroup) {
      this.getAllDataViaGroup();
    }
  }

  ngOnInit() {
  }

  getStudentGroupList(professorId?: number) {
    if (professorId) {
      this.traineeshipRest.getGroupsByProfessor(professorId).subscribe(
        (studentGroupList: StudentGroup[]) => {
          this.studentGroupList = studentGroupList;
        },
        error => {
          console.log(error.message);
          this.notification.open(ServerResponse.NO_RESPONSE);
        }
      );
    } else {
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
  }

  getAllDataViaGroup(isReset?: boolean) {
    if (isReset) {
      this.resetDataAfterChangingGroup();
    }
    // Student list
    this.studentRest.getAll(this.filter.studentGroup.id).subscribe(
      (studentList: Student[]) => {
        this.studentList = studentList;
      },
      error => {
        console.log(error.message);
        this.notification.open(ServerResponse.NO_RESPONSE);
      }
    );
    // Traineeship list
    let profId: number;
    if (this.filter.professor) {
      profId = this.filter.professor.id;
    }
    this.traineeshipRest.getAll(this.filter.studentGroup.id, profId).subscribe(
      (traineeshipList: Traineeship[]) => {
        for (const traineeship of traineeshipList) {
          if (!this.traineeshipList.find(t => t.id === traineeship.id)) {
            this.traineeshipList.push(traineeship);
          }
          if (this.filter.showProfessor) { // admin - student mode
            if (!this.professorList.find(professor => professor.id === traineeship.professor.id)) {
              this.professorList.push(traineeship.professor);
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

  compareStudentGroup(sg1: StudentGroup, sg2: StudentGroup) {
    if (sg1 && sg2) {
      return sg1.id === sg2.id;
    }
  }

  compareStudent(s1: Student, s2: Student) {
    if (s1 && s2) {
      return s1.id === s2.id;
    }
  }

  compareProfessor(p1: Professor, p2: Professor) {
    if (p1 && p2) {
      return p1.id === p2.id;
    }
  }

  compareTraineeship(t1: Traineeship, t2: Traineeship) {
    if (t1 && t2) {
      return t1.id === t2.id;
    }
  }

  resetDataAfterChangingGroup() {
    this.filter.student = undefined;
    this.traineeshipList = [];
    this.filter.traineeship = undefined;
    if (this.filter.showProfessor) { // student - admin
      this.professorList = [];
      this.filter.professor = undefined;
    }
  }

  save() {
    this.dialogRef.close(this.filter);
  }

  disableSaveBtn(): boolean {
    return false;
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
