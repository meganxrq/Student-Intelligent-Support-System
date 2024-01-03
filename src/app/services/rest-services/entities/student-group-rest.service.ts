import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {StudentGroup} from '../../../models/entities/student-group';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';

@Injectable({
  providedIn: 'root'
})
export class StudentGroupRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<StudentGroup>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<StudentGroup>>(HOST.dbUrl + '/studentGroup' + filter, {headers});
  }

  getById(id: number): Observable<StudentGroup> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<StudentGroup>(HOST.dbUrl + '/studentGroup/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/studentGroup/getTotalCount', {headers});
  }

  getAll(professorId?: number): Observable<StudentGroup[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    if (professorId > 0) {
      return this.http.get<StudentGroup[]>(HOST.dbUrl + '/studentGroup/getAll?profId=' + professorId, {headers});
    }
    return this.http.get<StudentGroup[]>(HOST.dbUrl + '/studentGroup/getAll', {headers});
  }

  // CREATE
  create(studentGroup: StudentGroup): Observable<StudentGroup> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<StudentGroup>(HOST.dbUrl + '/studentGroup', studentGroup, {headers});
  }

  // UPDATE
  update(studentGroup: StudentGroup): Observable<StudentGroup> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<StudentGroup>(HOST.dbUrl + '/studentGroup', studentGroup, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/studentGroup/' + idArray.join(','), {headers});
  }

}
