import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RoutingModule} from './routing/routing.module';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './material-modules/material.module';
import {EntityListSideNavComponent} from './components/entity-list-side-nav/entity-list-side-nav.component';
import {EntityShowChooserComponent} from './components/entity-list-side-nav/entity-show-chooser/entity-show-chooser.component';
import {HttpClientModule} from '@angular/common/http';
import {DepartmentTableComponent} from './components/entity-pages/department/department-table/department-table.component';
import {FacultyTableComponent} from './components/entity-pages/faculty/faculty-table/faculty-table.component';
import {EduFormTableComponent} from './components/entity-pages/edu-form/edu-form-table/edu-form-table.component';
import {EduFundTableComponent} from './components/entity-pages/edu-fund/edu-fund-table/edu-fund-table.component';
import {LessonTableComponent} from './components/entity-pages/lesson/lesson-table/lesson-table.component';
import {LessonTypeTableComponent} from './components/entity-pages/lesson-type/lesson-type-table/lesson-type-table.component';
import {ProfessorTableComponent} from './components/entity-pages/professor/professor-table/professor-table.component';
import {ProfessorDegreeTableComponent} from './components/entity-pages/professor-degree/professor-degree-table/professor-degree-table.component';
import {ProfessorSciWorkTableComponent} from './components/entity-pages/professor-sci-work/professor-sci-work-table/professor-sci-work-table.component';
import {ScholarshipTableComponent} from './components/entity-pages/scholarship/scholarship-table/scholarship-table.component';
import {SpecialtyTableComponent} from './components/entity-pages/specialty/specialty-table/specialty-table.component';
import {SpecialtyFieldTableComponent} from './components/entity-pages/specialty-field/specialty-field-table/specialty-field-table.component';
import {StudentTableComponent} from './components/entity-pages/student/student-table/student-table.component';
import {StudentGroupTableComponent} from './components/entity-pages/student-group/student-group-table/student-group-table.component';
import {StudentProgressTableComponent} from './components/entity-pages/student-progress/student-progress-table/student-progress-table.component';
import {StudentSciWorkTableComponent} from './components/entity-pages/student-sci-work/student-sci-work-table/student-sci-work-table.component';
import {SubjectTableComponent} from './components/entity-pages/subject/subject-table/subject-table.component';
import {TestingTypeTableComponent} from './components/entity-pages/testing-type/testing-type-table/testing-type-table.component';
import {TraineeshipTypeTableComponent} from './components/entity-pages/traineeship-type/traineeship-type-table/traineeship-type-table.component';
import {TraineeshipTableComponent} from './components/entity-pages/traineeship/traineeship-table/traineeship-table.component';
import {SignInComponent} from './components/sign-in/sign-in.component';
import {HeaderComponent} from './components/header/header.component';
import {FacultyEditorComponent} from './components/entity-pages/faculty/faculty-editor/faculty-editor.component';
import {DepartmentEditorComponent} from './components/entity-pages/department/department-editor/department-editor.component';
import {LessonEditorComponent} from './components/entity-pages/lesson/lesson-editor/lesson-editor.component';
import {EduFundEditorComponent} from './components/entity-pages/edu-fund/edu-fund-editor/edu-fund-editor.component';
import {EduFormEditorComponent} from './components/entity-pages/edu-form/edu-form-editor/edu-form-editor.component';
import {LessonTypeEditorComponent} from './components/entity-pages/lesson-type/lesson-type-editor/lesson-type-editor.component';
import {ProfessorEditorComponent} from './components/entity-pages/professor/professor-editor/professor-editor.component';
import {ProfessorDegreeEditorComponent} from './components/entity-pages/professor-degree/professor-degree-editor/professor-degree-editor.component';
import {ProfessorSciWorkEditorComponent} from './components/entity-pages/professor-sci-work/professor-sci-work-editor/professor-sci-work-editor.component';
import {ScholarshipEditorComponent} from './components/entity-pages/scholarship/scholarship-editor/scholarship-editor.component';
import {SpecialtyEditorComponent} from './components/entity-pages/specialty/specialty-editor/specialty-editor.component';
import {SpecialtyFieldEditorComponent} from './components/entity-pages/specialty-field/specialty-field-editor/specialty-field-editor.component';
import {StudentEditorComponent} from './components/entity-pages/student/student-editor/student-editor.component';
import {StudentGroupEditorComponent} from './components/entity-pages/student-group/student-group-editor/student-group-editor.component';
import {StudentProgressEditorComponent} from './components/entity-pages/student-progress/student-progress-editor/student-progress-editor.component';
import {StudentSciWorkEditorComponent} from './components/entity-pages/student-sci-work/student-sci-work-editor/student-sci-work-editor.component';
import {SubjectEditorComponent} from './components/entity-pages/subject/subject-editor/subject-editor.component';
import {TestingTypeEditorComponent} from './components/entity-pages/testing-type/testing-type-editor/testing-type-editor.component';
import {TraineeshipTypeEditorComponent} from './components/entity-pages/traineeship-type/traineeship-type-editor/traineeship-type-editor.component';
import {TraineeshipEditorComponent} from './components/entity-pages/traineeship/traineeship-editor/traineeship-editor.component';
import {EduFormFilterComponent} from './components/entity-pages/edu-form/edu-form-filter/edu-form-filter.component';
import {EduFundFilterComponent} from './components/entity-pages/edu-fund/edu-fund-filter/edu-fund-filter.component';
import {DepartmentFilterComponent} from './components/entity-pages/department/department-filter/department-filter.component';
import {FacultyFilterComponent} from './components/entity-pages/faculty/faculty-filter/faculty-filter.component';
import {LessonTypeFilterComponent} from './components/entity-pages/lesson-type/lesson-type-filter/lesson-type-filter.component';
import {ProfessorDegreeFilterComponent} from './components/entity-pages/professor-degree/professor-degree-filter/professor-degree-filter.component';
import {ScholarshipFilterComponent} from './components/entity-pages/scholarship/scholarship-filter/scholarship-filter.component';
import {SubjectFilterComponent} from './components/entity-pages/subject/subject-filter/subject-filter.component';
import {TestingTypeFilterComponent} from './components/entity-pages/testing-type/testing-type-filter/testing-type-filter.component';
import {TraineeshipTypeFilterComponent} from './components/entity-pages/traineeship-type/traineeship-type-filter/traineeship-type-filter.component';
import {ProfessorFilterComponent} from './components/entity-pages/professor/professor-filter/professor-filter.component';
import {SpecialtyFilterComponent} from './components/entity-pages/specialty/specialty-filter/specialty-filter.component';
import {SpecialtyFieldFilterComponent} from './components/entity-pages/specialty-field/specialty-field-filter/specialty-field-filter.component';
import {StudentGroupFilterComponent} from './components/entity-pages/student-group/student-group-filter/student-group-filter.component';
import {LessonFilterComponent} from './components/entity-pages/lesson/lesson-filter/lesson-filter.component';
import {StudentFilterComponent} from './components/entity-pages/student/student-filter/student-filter.component';
import {StudentProgressFilterComponent} from './components/entity-pages/student-progress/student-progress-filter/student-progress-filter.component';
import {StudentSciWorkTypeEditorComponent} from './components/entity-pages/student-sci-work-type/student-sci-work-type-editor/student-sci-work-type-editor.component';
import {StudentSciWorkTypeTableComponent} from './components/entity-pages/student-sci-work-type/student-sci-work-type-table/student-sci-work-type-table.component';
import {ProfessorSciWorkTypeEditorComponent} from './components/entity-pages/professor-sci-work-type/professor-sci-work-type-editor/professor-sci-work-type-editor.component';
import {ProfessorSciWorkTypeTableComponent} from './components/entity-pages/professor-sci-work-type/professor-sci-work-type-table/professor-sci-work-type-table.component';
import { ProfessorSciWorkTypeFilterComponent } from './components/entity-pages/professor-sci-work-type/professor-sci-work-type-filter/professor-sci-work-type-filter.component';
import { StudentSciWorkTypeFilterComponent } from './components/entity-pages/student-sci-work-type/student-sci-work-type-filter/student-sci-work-type-filter.component';
import { ProfessorSciWorkFilterComponent } from './components/entity-pages/professor-sci-work/professor-sci-work-filter/professor-sci-work-filter.component';
import { StudentSciWorkFilterComponent } from './components/entity-pages/student-sci-work/student-sci-work-filter/student-sci-work-filter.component';
import { TraineeshipFilterComponent } from './components/entity-pages/traineeship/traineeship-filter/traineeship-filter.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { StudyProgressComponent } from './components/study-progress/study-progress.component';
import { TraineeshipProgressEditorComponent } from './components/entity-pages/traineeship-progress/traineeship-progress-editor/traineeship-progress-editor.component';
import { TraineeshipProgressFilterComponent } from './components/entity-pages/traineeship-progress/traineeship-progress-filter/traineeship-progress-filter.component';
import { TraineeshipProgressTableComponent } from './components/entity-pages/traineeship-progress/traineeship-progress-table/traineeship-progress-table.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StudentProfileComponent } from './components/profile/student-profile/student-profile.component';


const tables = [
  DepartmentTableComponent,
  FacultyTableComponent,
  EduFormTableComponent,
  EduFundTableComponent,
  LessonTableComponent,
  LessonTypeTableComponent,
  ProfessorTableComponent,
  ProfessorDegreeTableComponent,
  ProfessorSciWorkTableComponent,
  ScholarshipTableComponent,
  SpecialtyTableComponent,
  SpecialtyFieldTableComponent,
  StudentTableComponent,
  StudentGroupTableComponent,
  StudentProgressTableComponent,
  StudentSciWorkTableComponent,
  SubjectTableComponent,
  TestingTypeTableComponent,
  TraineeshipTypeTableComponent,
  TraineeshipTableComponent,
  StudentSciWorkTypeTableComponent,
  ProfessorSciWorkTypeTableComponent,
  TraineeshipProgressTableComponent
];

const editors = [
  DepartmentEditorComponent,
  FacultyEditorComponent,
  EduFormEditorComponent,
  EduFundEditorComponent,
  LessonEditorComponent,
  LessonTypeEditorComponent,
  ProfessorEditorComponent,
  ProfessorDegreeEditorComponent,
  ProfessorSciWorkEditorComponent,
  ScholarshipEditorComponent,
  SpecialtyEditorComponent,
  SpecialtyFieldEditorComponent,
  StudentEditorComponent,
  StudentGroupEditorComponent,
  StudentProgressEditorComponent,
  StudentSciWorkEditorComponent,
  SubjectEditorComponent,
  TestingTypeEditorComponent,
  TraineeshipTypeEditorComponent,
  TraineeshipEditorComponent,
  StudentSciWorkTypeEditorComponent,
  ProfessorSciWorkTypeEditorComponent,
  TraineeshipProgressEditorComponent
];

const filters = [
  DepartmentFilterComponent,
  EduFormFilterComponent,
  EduFundFilterComponent,
  FacultyFilterComponent,
  LessonTypeFilterComponent,
  ProfessorDegreeFilterComponent,
  ScholarshipFilterComponent,
  SubjectFilterComponent,
  TestingTypeFilterComponent,
  TraineeshipTypeFilterComponent,
  ProfessorFilterComponent,
  SpecialtyFilterComponent,
  SpecialtyFieldFilterComponent,
  StudentGroupFilterComponent,
  LessonFilterComponent,
  StudentFilterComponent,
  StudentProgressFilterComponent,
  ProfessorSciWorkTypeFilterComponent,
  StudentSciWorkTypeFilterComponent,
  ProfessorSciWorkFilterComponent,
  StudentSciWorkFilterComponent,
  TraineeshipFilterComponent,
  TraineeshipProgressFilterComponent
];

@NgModule({
  declarations: [
    AppComponent,
    EntityListSideNavComponent,
    EntityShowChooserComponent,
    SignInComponent,
    HeaderComponent,
    tables,
    editors,
    filters,
    ErrorPageComponent,
    StudyProgressComponent,
    ProfileComponent,
    StudentProfileComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RoutingModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [editors, filters]
})
export class AppModule {
}
