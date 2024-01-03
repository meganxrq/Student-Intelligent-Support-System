import {Professor} from './professor';
import {Subject} from './subject';
import {StudentGroup} from './student-group';
import {Type} from './type';

export interface Lesson {

  id: number;
  subject: Subject;
  professor: Professor;
  testingType: Type;
  lessonType: Type;
  startDate: string;
  endDate: string;
  hourCount: number;
  studentGroupList: StudentGroup[];

}
