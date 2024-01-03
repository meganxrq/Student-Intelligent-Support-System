import {Faculty} from './faculty';

export interface Specialty {

  code: string;
  name: string;
  program: string;
  duration: number;
  faculty: Faculty;

}
