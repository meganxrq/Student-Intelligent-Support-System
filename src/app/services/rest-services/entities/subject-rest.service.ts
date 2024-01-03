import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subject} from '../../../models/entities/subject';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class SubjectRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Subject>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Subject>>(HOST.dbUrl + '/subject' + filter, {headers});
  }

  getById(id: number): Observable<Subject> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Subject>(HOST.dbUrl + '/subject/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/subject/getTotalCount', {headers});
  }

  getAll(): Observable<Subject[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Subject[]>(HOST.dbUrl + '/subject/getAll', {headers});
  }

  // CREATE
  create(subject: Subject): Observable<Subject> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Subject>(HOST.dbUrl + '/subject', subject, {headers});
  }

  // UPDATE
  update(subject: Subject): Observable<Subject> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Subject>(HOST.dbUrl + '/subject', subject, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/subject/' + idArray.join(','), {headers});
  }

}
