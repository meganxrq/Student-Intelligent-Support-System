import {Scholarship} from './scholarship';
import {EduFund} from './edu-fund';
import {StudentGroup} from './student-group';

export interface Student {

  id: number;
  sex: string;
  firstName: string;
  lastName: string;
  studentGroup: StudentGroup;
  scholarship: Scholarship;
  eduFund: EduFund;
  username: string;
  password: string;

}
