import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProfessorSciWork} from '../../../models/entities/professor-sci-work';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class ProfessorSciWorkRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<ProfessorSciWork>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<ProfessorSciWork>>(HOST.dbUrl + '/professorSciWork' + filter, {headers});
  }

  getById(id: number): Observable<ProfessorSciWork> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<ProfessorSciWork>(HOST.dbUrl + '/professorSciWork/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/professorSciWork/getTotalCount', {headers});
  }

  // CREATE
  create(professorSciWork: ProfessorSciWork): Observable<ProfessorSciWork> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<ProfessorSciWork>(HOST.dbUrl + '/professorSciWork', professorSciWork, {headers});
  }

  // UPDATE
  update(professorSciWork: ProfessorSciWork): Observable<ProfessorSciWork> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<ProfessorSciWork>(HOST.dbUrl + '/professorSciWork', professorSciWork, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/professorSciWork/' + idArray.join(','), {headers});
  }

}
