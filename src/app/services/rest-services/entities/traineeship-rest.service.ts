import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Traineeship} from '../../../models/entities/traineeship';
import {HOST} from '../../../constants/const';
import {EntityPage} from '../../../models/entity-page';
import {StudentGroup} from '../../../models/entities/student-group';

@Injectable({
  providedIn: 'root'
})
export class TraineeshipRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<Traineeship>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<Traineeship>>(HOST.dbUrl + '/traineeship' + filter, {headers});
  }

  getById(id: number): Observable<Traineeship> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<Traineeship>(HOST.dbUrl + '/traineeship/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/traineeship/getTotalCount', {headers});
  }

  getAll(groupId: number, profId?: number): Observable<Traineeship[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    if (profId > 0) {
      return this.http.get<Traineeship[]>(HOST.dbUrl + '/traineeship/getAll?groupId=' + groupId + '&profId=' + profId, {headers});
    }
    return this.http.get<Traineeship[]>(HOST.dbUrl + '/traineeship/getAll?groupId=' + groupId, {headers});
  }

  getGroupsByProfessor(profId: number): Observable<StudentGroup[]> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<StudentGroup[]>(HOST.dbUrl + '/traineeship/getGroups?profId=' + profId, {headers});
  }

  // CREATE
  create(traineeship: Traineeship): Observable<Traineeship> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<Traineeship>(HOST.dbUrl + '/traineeship', traineeship, {headers});
  }

  // UPDATE
  update(traineeship: Traineeship): Observable<Traineeship> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<Traineeship>(HOST.dbUrl + '/traineeship', traineeship, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/traineeship/' + idArray.join(','), {headers});
  }

}
