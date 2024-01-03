import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SpecialtyField} from '../../../models/entities/specialty-field';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyFieldRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<SpecialtyField>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<SpecialtyField>>(HOST.dbUrl + '/specialtyField' + filter, {headers});
  }

  getById(id: number): Observable<SpecialtyField> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<SpecialtyField>(HOST.dbUrl + '/specialtyField/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/specialtyField/getTotalCount', {headers});
  }

  getAll(specialtyCode?: string): Observable<SpecialtyField[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    if (specialtyCode) {
      return this.http.get<SpecialtyField[]>(HOST.dbUrl + '/specialtyField/getAll?sCode=' + specialtyCode, {headers});
    }
    return this.http.get<SpecialtyField[]>(HOST.dbUrl + '/specialtyField/getAll', {headers});
  }

  // CREATE
  create(specialtyField: SpecialtyField): Observable<SpecialtyField> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<SpecialtyField>(HOST.dbUrl + '/specialtyField', specialtyField, {headers});
  }

  // UPDATE
  update(specialtyField: SpecialtyField): Observable<SpecialtyField> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<SpecialtyField>(HOST.dbUrl + '/specialtyField', specialtyField, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/specialtyField/' + idArray.join(','), {headers});
  }

}
