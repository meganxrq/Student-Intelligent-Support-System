import {Department} from './entities/department';
import {ProfessorDegree} from './entities/professor-degree';
import {StudentGroup} from './entities/student-group';
import {Scholarship} from './entities/scholarship';
import {EduFund} from './entities/edu-fund';

export interface User {

  // Common
  id?: number;
  sex?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  password: string;
  // Professor
  department?: Department;
  degree?: ProfessorDegree;
  // Student
  studentGroup?: StudentGroup;
  scholarship?: Scholarship;
  eduFund?: EduFund;

}
