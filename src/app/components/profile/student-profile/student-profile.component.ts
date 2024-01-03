import { Component, OnInit } from '@angular/core';
import {Student} from "../../../models/entities/student";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.less']
})
export class StudentProfileComponent implements OnInit {

  student: Student;

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.student = this.userService.getMe() as Student;
  }

}
