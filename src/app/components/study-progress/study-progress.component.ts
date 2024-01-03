import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './study-progress.component.html',
  styleUrls: ['./study-progress.component.less']
})
export class StudyProgressComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
