import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Student} from '../../../models/entities/student';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class StudentRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Student>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Student>>(HOST.dbUrl + '/student' + filter, {headers});
  }

  getById(id: number): Observable<Student> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Student>(HOST.dbUrl + '/student/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/student/getTotalCount', {headers});
  }

  getAll(studentGroupId: number): Observable<Student[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Student[]>(HOST.dbUrl + '/student/getAll?groupId=' + studentGroupId, {headers});
  }

  getCredentials(studId: number): Observable<string[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<string[]>(HOST.dbUrl + '/student/getCredentials?studId=' + studId, {headers});
  }

  // CREATE
  create(student: Student): Observable<Student> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Student>(HOST.dbUrl + '/student', student, {headers});
  }

  // UPDATE
  update(student: Student): Observable<Student> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Student>(HOST.dbUrl + '/student', student, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/student/' + idArray.join(','), {headers});
  }

}
