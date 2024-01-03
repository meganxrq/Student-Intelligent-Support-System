import {Department} from './department';
import {ProfessorDegree} from './professor-degree';

export interface Professor {

  id: number;
  sex: string;
  firstName: string;
  lastName: string;
  department: Department;
  degree: ProfessorDegree;
  username: string;
  password: string;

}
