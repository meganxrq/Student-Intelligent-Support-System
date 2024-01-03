import {Professor} from './professor';

export interface ProfessorSciWork {

  id: number;
  type: string;
  topic: string;
  defenseStatus: string;
  defenseDate: string;
  professor: Professor;

}
