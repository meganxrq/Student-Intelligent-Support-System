import {Injectable} from '@angular/core';
import {UserRestService} from './rest-services/user-rest.service';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private me: User;

  constructor(
    private userRest: UserRestService,
    private router: Router
  ) {
  }

  getUser(login: string, password: string): Observable<User> {
    return this.userRest.getUser(login, password);
  }

  auth(): Observable<User> {
    return this.userRest.auth(localStorage.getItem('token'));
  }

  setMe(newUser: User) {
    this.me = newUser;
  }

  getMe(): User {
    return this.me;
  }

  signOut() {
    this.me = undefined;
    localStorage.removeItem('token');
    this.router.navigateByUrl('/sign-in');
  }

  hasUserBeenLoaded(): boolean {
    return this.me !== undefined;
  }

  isSignedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getBeautyName(): string {
    if (this.isAdmin()) {
      return 'Admin';
    }
    if (this.me) {
      return this.me.firstName + ' ' + this.me.lastName;
    }
    return 'Please, wait...';
  }

  isAdmin(): boolean {
    if (this.me) {
      return localStorage.getItem('token') !== null
        && this.me.lastName === undefined;
    }
    return false;
  }

  isProfessor(): boolean {
    if (this.me) {
      return localStorage.getItem('token') !== null
        && this.me.degree !== undefined;
    }
    return false;
  }

  isStudent(): boolean {
    if (this.me) {
      return localStorage.getItem('token') !== null
        && this.me.studentGroup !== undefined;
    }
    return false;
  }

}
