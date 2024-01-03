import {StudentGroup} from './student-group';
import {Professor} from './professor';
import {Type} from './type';

export interface Traineeship {

  id: number;
  traineeshipType: Type;
  professor: Professor;
  startDate: string;
  endDate: string;
  studentGroupList: StudentGroup[];

}
