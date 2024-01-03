import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-entity-show-chooser',
  templateUrl: './entity-show-chooser.component.html',
  styleUrls: ['./entity-show-chooser.component.less']
})
export class EntityShowChooserComponent implements OnInit {

  @Input() entity: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

}
