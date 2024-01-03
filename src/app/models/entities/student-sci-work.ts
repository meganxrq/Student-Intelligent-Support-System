import {Student} from './student';
import {Professor} from './professor';

export interface StudentSciWork {

  id: number;
  type: string;
  topic: string;
  defenseStatus: string;
  defenseDate: string;
  student: Student;
  professor: Professor;

}
