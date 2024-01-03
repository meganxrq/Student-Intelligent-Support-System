import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Scholarship} from '../../../models/entities/scholarship';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class ScholarshipRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Scholarship>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Scholarship>>(HOST.dbUrl + '/scholarship' + filter, {headers});
  }

  getById(id: number): Observable<Scholarship> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Scholarship>(HOST.dbUrl + '/scholarship/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/scholarship/getTotalCount', {headers});
  }

  getAll(): Observable<Scholarship[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Scholarship[]>(HOST.dbUrl + '/scholarship/getAll', {headers});
  }

  // CREATE
  create(scholarship: Scholarship): Observable<Scholarship> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Scholarship>(HOST.dbUrl + '/scholarship', scholarship, {headers});
  }

  // UPDATE
  update(scholarship: Scholarship): Observable<Scholarship> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Scholarship>(HOST.dbUrl + '/scholarship', scholarship, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/scholarship/' + idArray.join(','), {headers});
  }

}
