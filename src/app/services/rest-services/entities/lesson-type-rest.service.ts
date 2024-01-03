import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Type} from '../../../models/entities/type';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class LessonTypeRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Type>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Type>>(HOST.dbUrl + '/lessonType' + filter, {headers});
  }

  getById(id: number): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Type>(HOST.dbUrl + '/lessonType/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/lessonType/getTotalCount', {headers});
  }

  getAll(): Observable<Type[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Type[]>(HOST.dbUrl + '/lessonType/getAll', {headers});
  }

  // CREATE
  create(lessonType: Type): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Type>(HOST.dbUrl + '/lessonType', lessonType, {headers});
  }

  // UPDATE
  update(lessonType: Type): Observable<Type> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Type>(HOST.dbUrl + '/lessonType', lessonType, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/lessonType/' + idArray.join(','), {headers});
  }

}
