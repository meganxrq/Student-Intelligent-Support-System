import {SpecialtyField} from './specialty-field';
import {EduForm} from './edu-form';

export interface StudentGroup {

  id: number;
  number: number;
  specialtyField: SpecialtyField;
  eduForm: EduForm;
  startYear: number;

}
