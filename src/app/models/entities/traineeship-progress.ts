import {Student} from './student';
import {Traineeship} from './traineeship';

export interface TraineeshipProgress {

  id: number;
  student: Student;
  traineeship: Traineeship;
  finalScore: number;

}
