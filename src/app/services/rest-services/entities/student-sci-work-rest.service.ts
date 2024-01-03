import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StudentSciWork} from '../../../models/entities/student-sci-work';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class StudentSciWorkRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<StudentSciWork>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<StudentSciWork>>(HOST.dbUrl + '/studentSciWork' + filter, {headers});
  }

  getById(id: number): Observable<StudentSciWork> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<StudentSciWork>(HOST.dbUrl + '/studentSciWork/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/studentSciWork/getTotalCount', {headers});
  }

  // CREATE
  create(studentSciWork: StudentSciWork): Observable<StudentSciWork> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<StudentSciWork>(HOST.dbUrl + '/studentSciWork', studentSciWork, {headers});
  }

  // UPDATE
  update(studentSciWork: StudentSciWork): Observable<StudentSciWork> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<StudentSciWork>(HOST.dbUrl + '/studentSciWork', studentSciWork, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/studentSciWork/' + idArray.join(','), {headers});
  }

}
