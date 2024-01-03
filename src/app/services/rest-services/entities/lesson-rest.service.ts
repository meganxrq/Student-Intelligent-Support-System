import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Lesson} from '../../../models/entities/lesson';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';
import {StudentGroup} from '../../../models/entities/student-group';

@Injectable({
  providedIn: 'root'
})
export class LessonRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Lesson>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Lesson>>(HOST.dbUrl + '/lesson' + filter, {headers});
  }

  getById(id: number): Observable<Lesson> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Lesson>(HOST.dbUrl + '/lesson/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/lesson/getTotalCount', {headers});
  }

  getAll(groupId: number, profId?: number): Observable<Lesson[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    if (profId > 0) {
      return this.http.get<Lesson[]>(HOST.dbUrl + '/lesson/getAll?groupId=' + groupId + '&profId=' + profId, {headers});
    }
    return this.http.get<Lesson[]>(HOST.dbUrl + '/lesson/getAll?groupId=' + groupId, {headers});
  }

  getGroupsByProfessor(profId: number): Observable<StudentGroup[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<StudentGroup[]>(HOST.dbUrl + '/lesson/getGroups?profId=' + profId, {headers});
  }

  // CREATE
  create(lesson: Lesson): Observable<Lesson> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Lesson>(HOST.dbUrl + '/lesson', lesson, {headers});
  }

  // UPDATE
  update(lesson: Lesson): Observable<Lesson> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Lesson>(HOST.dbUrl + '/lesson', lesson, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/lesson/' + idArray.join(','), {headers});
  }

}
