import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SignInComponent} from '../components/sign-in/sign-in.component';
import {EntityListSideNavComponent} from '../components/entity-list-side-nav/entity-list-side-nav.component';
import {APP_BASE_HREF} from '@angular/common';
import {ErrorPageComponent} from '../components/error-page/error-page.component';
import {StudyProgressComponent} from '../components/study-progress/study-progress.component';
import {ProfileComponent} from "../components/profile/profile.component";

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'progress', component: StudyProgressComponent },
  { path: 'admin', component: EntityListSideNavComponent },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})
export class RoutingModule { }
