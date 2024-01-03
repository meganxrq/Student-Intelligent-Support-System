import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Faculty} from '../../../models/entities/faculty';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class FacultyRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Faculty>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Faculty>>(HOST.dbUrl + '/faculty' + filter, {headers});
  }

  getAll(): Observable<Faculty[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Faculty[]>(HOST.dbUrl + '/faculty/getAll', {headers});
  }

  getById(id: number): Observable<Faculty> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Faculty>(HOST.dbUrl + '/faculty/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/faculty/getTotalCount', {headers});
  }

  getFirst(): Observable<Faculty> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Faculty>(HOST.dbUrl + '/faculty/getFirst', {headers});
  }

  // CREATE
  create(faculty: Faculty): Observable<Faculty> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Faculty>(HOST.dbUrl + '/faculty', faculty, {headers});
  }

  // UPDATE
  update(faculty: Faculty): Observable<Faculty> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Faculty>(HOST.dbUrl + '/faculty', faculty, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/faculty/' + idArray.join(','), {headers});
  }

}
