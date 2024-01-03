import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department} from '../../../models/entities/department';
import {EntityPage} from '../../../models/entity-page';
import {HOST} from '../../../constants/const';

@Injectable({
  providedIn: 'root'
})
export class DepartmentRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Department>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Department>>(HOST.dbUrl + '/department' + filter, {headers});
  }

  getById(id: number): Observable<Department> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Department>(HOST.dbUrl + '/department/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/department/getTotalCount', {headers});
  }

  getAll(facultyShortName: string): Observable<Department[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Department[]>(HOST.dbUrl + '/department/getAll?fName=' + facultyShortName, {headers});
  }

  // CREATE
  create(department: Department): Observable<Department> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Department>(HOST.dbUrl + '/department', department, {headers});
  }

  // UPDATE
  update(department: Department): Observable<Department> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Department>(HOST.dbUrl + '/department', department, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/department/' + idArray.join(','), {headers});
  }

}
