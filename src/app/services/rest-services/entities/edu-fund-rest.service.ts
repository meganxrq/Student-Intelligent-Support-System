import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EduFund} from '../../../models/entities/edu-fund';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class EduFundRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<EduFund>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<EduFund>>(HOST.dbUrl + '/eduFund' + filter, {headers});
  }

  getById(id: number): Observable<EduFund> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EduFund>(HOST.dbUrl + '/eduFund/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/eduFund/getTotalCount', {headers});
  }

  getAll(): Observable<EduFund[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EduFund[]>(HOST.dbUrl + '/eduFund/getAll', {headers});
  }

  // CREATE
  create(eduFund: EduFund): Observable<EduFund> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<EduFund>(HOST.dbUrl + '/eduFund', eduFund, {headers});
  }

  // UPDATE
  update(eduFund: EduFund): Observable<EduFund> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<EduFund>(HOST.dbUrl + '/eduFund', eduFund, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/eduFund/' + idArray.join(','), {headers});
  }

}
