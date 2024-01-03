import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Professor} from '../../../models/entities/professor';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class ProfessorRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Professor>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Professor>>(HOST.dbUrl + '/professor' + filter, {headers});
  }

  getById(id: number): Observable<Professor> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Professor>(HOST.dbUrl + '/professor/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/professor/getTotalCount', {headers});
  }

  getAll(deptName: string): Observable<Professor[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Professor[]>(HOST.dbUrl + '/professor/getAll?deptName=' + deptName, {headers});
  }

  getCredentials(profId: number): Observable<string[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<string[]>(HOST.dbUrl + '/professor/getCredentials?profId=' + profId, {headers});
  }

  // CREATE
  create(professor: Professor): Observable<Professor> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Professor>(HOST.dbUrl + '/professor', professor, {headers});
  }

  // UPDATE
  update(professor: Professor): Observable<Professor> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Professor>(HOST.dbUrl + '/professor', professor, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/professor/' + idArray.join(','), {headers});
  }

}
