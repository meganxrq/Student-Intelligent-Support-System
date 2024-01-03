import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateTimeFormatterService {

  constructor(private datePipe: DatePipe) {
  }

  get_yyyy_MM_dd(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

}
