import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Specialty} from '../../../models/entities/specialty';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Specialty>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Specialty>>(HOST.dbUrl + '/specialty' + filter, {headers});
  }

  getByCode(code: string): Observable<Specialty> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Specialty>(HOST.dbUrl + '/specialty/getByCode/' + code, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/specialty/getTotalCount', {headers});
  }

  getAll(facultyShortName: string): Observable<Specialty[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Specialty[]>(HOST.dbUrl + '/specialty/getAll?fShortName=' + facultyShortName, {headers});
  }

  // CREATE
  create(specialty: Specialty): Observable<Specialty> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Specialty>(HOST.dbUrl + '/specialty', specialty, {headers});
  }

  // UPDATE
  update(specialty: Specialty): Observable<Specialty> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Specialty>(HOST.dbUrl + '/specialty', specialty, {headers});
  }

  // DELETE
  deleteByCodes(codeArray: string[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/specialty/' + codeArray.join(','), {headers});
  }

}
