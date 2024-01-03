export const HOST = {
  url: 'http://localhost:8080',
  dbUrl: 'http://localhost:8080/db'
  /*url: window.location.origin,
  dbUrl: window.location.origin + '/db'*/
};

export const DB_ENTITIES = [
  'Departments',
  'Education forms',
  'Education funds',
  'Faculties',
  'Lesson types',
  'Lessons',
  'Professor degrees',
  'Professor scientific works',
  'Professor scientific work types',
  'Professors',
  'Scholarships',
  'Specialties',
  'Specialty fields',
  'Student groups',
  'Student progress',
  'Student scientific works',
  'Student scientific work types',
  'Students',
  'Subjects',
  'Testing types',
  'Traineeship types',
  'Traineeship progress',
  'Traineeships'
];

export const ServerResponse = {
  NO_RESPONSE: 'Error: the server did not response',
  SUCCESS: 'Success!',
  NOT_ALL_DELETED: 'Error: not all records were deleted',
  NO_SUCH_RECORD: 'Error: there is no longer such a record',
  RECORD_ALREADY_EXISTS: 'Error: there is already such a record'
};

export const SEX = [
  'Male',
  'Female'
];

export const PASS_STATUS = [
  'Passed',
  'Failed'
];

/*export const Dialog = {
  DIALOG_WIDTH: '',
  DIALOG_HEIGHT: ''
};*/

export const PROGRAM_LIST = [
  'Bachelor',
  'Specialist',
  'Master\'s degree'
];
