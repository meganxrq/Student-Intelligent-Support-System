import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EntityPage} from '../../../models/entity-page';
import {TraineeshipProgress} from '../../../models/entities/traineeship-progress';
import {HOST} from '../../../constants/const';

@Injectable({
  providedIn: 'root'
})
export class TraineeshipProgressRestService {

  constructor(private http: HttpClient) {
  }

  // GET
  getPage(filter: string): Observable<EntityPage<TraineeshipProgress>> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<EntityPage<TraineeshipProgress>>(HOST.dbUrl + '/traineeshipProgress' + filter, {headers});
  }

  getById(id: number): Observable<TraineeshipProgress> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<TraineeshipProgress>(HOST.dbUrl + '/traineeshipProgress/getById/' + id, {headers});
  }

  getTotalCount(): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.get<number>(HOST.dbUrl + '/traineeshipProgress/getTotalCount', {headers});
  }

  // CREATE
  create(traineeshipProgress: TraineeshipProgress): Observable<TraineeshipProgress> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.post<TraineeshipProgress>(HOST.dbUrl + '/traineeshipProgress', traineeshipProgress, {headers});
  }

  // UPDATE
  update(traineeshipProgress: TraineeshipProgress): Observable<TraineeshipProgress> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.put<TraineeshipProgress>(HOST.dbUrl + '/traineeshipProgress', traineeshipProgress, {headers});
  }

  // DELETE
  deleteByIds(idArray: number[]): Observable<number> {
    const headers = new HttpHeaders({Authorization: localStorage.getItem('token')});
    return this.http.delete<number>(HOST.dbUrl + '/traineeshipProgress/' + idArray.join(','), {headers});
  }
}
