import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Type} from '../../../models/entities/type';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class ProfessorSciWorkTypeRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Type>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Type>>(HOST.dbUrl + '/professorSciWorkType' + filter, {headers});
  }

  getById(id: number): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Type>(HOST.dbUrl + '/professorSciWorkType/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/professorSciWorkType/getTotalCount', {headers});
  }

  getAll(): Observable<Type[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Type[]>(HOST.dbUrl + '/professorSciWorkType/getAll', {headers});
  }

  // CREATE
  create(professorSciWorkType: Type): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Type>(HOST.dbUrl + '/professorSciWorkType', professorSciWorkType, {headers});
  }

  // UPDATE
  update(professorSciWorkType: Type): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Type>(HOST.dbUrl + '/professorSciWorkType', professorSciWorkType, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/professorSciWorkType/' + idArray.join(','), {headers});
  }

}
