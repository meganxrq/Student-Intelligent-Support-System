import { Component, OnInit } from '@angular/core';
import {DB_ENTITIES} from '../../constants/const';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-entity-list-side-nav',
  templateUrl: './entity-list-side-nav.component.html',
  styleUrls: ['./entity-list-side-nav.component.less']
})
export class EntityListSideNavComponent implements OnInit {

  private entities: string[] = DB_ENTITIES;
  private currentEntity = 'Traineeship progress';

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  openDatabaseTool(entity: string) {
    this.currentEntity = entity;
  }

}
