import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Type} from '../../../models/entities/type';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class StudentSciWorkTypeRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Type>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Type>>(HOST.dbUrl + '/studentSciWorkType' + filter, {headers});
  }

  getById(id: number): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Type>(HOST.dbUrl + '/studentSciWorkType/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/studentSciWorkType/getTotalCount', {headers});
  }

  getAll(): Observable<Type[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Type[]>(HOST.dbUrl + '/studentSciWorkType/getAll', {headers});
  }

  // CREATE
  create(studentSciWorkType: Type): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Type>(HOST.dbUrl + '/studentSciWorkType', studentSciWorkType, {headers});
  }

  // UPDATE
  update(studentSciWorkType: Type): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Type>(HOST.dbUrl + '/studentSciWorkType', studentSciWorkType, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/studentSciWorkType/' + idArray.join(','), {headers});
  }

}
