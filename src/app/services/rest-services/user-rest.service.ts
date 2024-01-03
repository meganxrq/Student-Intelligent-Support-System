import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HOST} from '../../constants/const';
import {User} from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserRestService {

  constructor(private http: HttpClient) {
  }

  getUser(login: string, password: string): Observable<User> {
    const token: string = 'Basic ' + btoa(login + ':' + password);
    localStorage.setItem('tempToken', token);
    const headers = new HttpHeaders({Authorization: token});
    return this.http.get<User>(HOST.url + '/user', {headers});
  }

  auth(token: string): Observable<User> {
    const headers = new HttpHeaders({Authorization: token});
    return this.http.get<User>(HOST.url + '/user', {headers});
  }

}
