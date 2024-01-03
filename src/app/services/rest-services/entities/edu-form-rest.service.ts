import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EduForm} from '../../../models/entities/edu-form';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class EduFormRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<EduForm>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<EduForm>>(HOST.dbUrl + '/eduForm' + filter, {headers});
  }

  getById(id: number): Observable<EduForm> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EduForm>(HOST.dbUrl + '/eduForm/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/eduForm/getTotalCount', {headers});
  }

  getAll(): Observable<EduForm[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EduForm[]>(HOST.dbUrl + '/eduForm/getAll', {headers});
  }

  // CREATE
  create(eduForm: EduForm): Observable<EduForm> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<EduForm>(HOST.dbUrl + '/eduForm', eduForm, {headers});
  }

  // UPDATE
  update(eduForm: EduForm): Observable<EduForm> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<EduForm>(HOST.dbUrl + '/eduForm', eduForm, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/eduForm/' + idArray.join(','), {headers});
  }

}
