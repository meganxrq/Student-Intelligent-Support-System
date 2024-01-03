import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StudentProgress} from '../../../models/entities/student-progress';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class StudentProgressRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<StudentProgress>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<StudentProgress>>(HOST.dbUrl + '/studentProgress' + filter, {headers});
  }

  getById(id: number): Observable<StudentProgress> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<StudentProgress>(HOST.dbUrl + '/studentProgress/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/studentProgress/getTotalCount', {headers});
  }

  // CREATE
  create(studentProgress: StudentProgress): Observable<StudentProgress> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<StudentProgress>(HOST.dbUrl + '/studentProgress', studentProgress, {headers});
  }

  // UPDATE
  update(studentProgress: StudentProgress): Observable<StudentProgress> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<StudentProgress>(HOST.dbUrl + '/studentProgress', studentProgress, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/studentProgress/' + idArray.join(','), {headers});
  }

}
