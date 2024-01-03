import {Student} from './student';
import {Lesson} from './lesson';

export interface StudentProgress {

  id: number;
  student: Student;
  lesson: Lesson;
  finalScore: number;
  currentScore: number;
  missCount: number;

}
