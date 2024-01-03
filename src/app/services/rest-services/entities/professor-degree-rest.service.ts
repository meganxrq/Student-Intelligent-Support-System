import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfessorDegree} from '../../../models/entities/professor-degree';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class ProfessorDegreeRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<ProfessorDegree>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<ProfessorDegree>>(HOST.dbUrl + '/professorDegree' + filter, {headers});
  }

  getById(id: number): Observable<ProfessorDegree> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<ProfessorDegree>(HOST.dbUrl + '/professorDegree/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/professorDegree/getTotalCount', {headers});
  }

  getAll(): Observable<ProfessorDegree[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<ProfessorDegree[]>(HOST.dbUrl + '/professorDegree/getAll', {headers});
  }

  // CREATE
  create(professorDegree: ProfessorDegree): Observable<ProfessorDegree> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<ProfessorDegree>(HOST.dbUrl + '/professorDegree', professorDegree, {headers});
  }

  // UPDATE
  update(professorDegree: ProfessorDegree): Observable<ProfessorDegree> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<ProfessorDegree>(HOST.dbUrl + '/professorDegree', professorDegree, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/professorDegree/' + idArray.join(','), {headers});
  }

}
