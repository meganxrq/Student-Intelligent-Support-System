package com.megan.university.controllers;

import com.megan.university.Storage;
import com.megan.university.services.entities.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/dbfill")
@RequiredArgsConstructor
public class DataBaseFillController {

    private final DepartmentService departmentService;
    private final EduFormService eduFormService;
    private final EduFundService eduFundService;
    private final FacultyService facultyService;
    private final LessonService lessonService;
    private final LessonTypeService lessonTypeService;
    private final ProfessorService professorService;
    private final ProfessorDegreeService professorDegreeService;
    private final ProfessorSciWorkService professorSciWorkService;
    private final ProfessorSciWorkTypeService professorSciWorkTypeService;
    private final ScholarshipService scholarshipService;
    private final SpecialtyService specialtyService;
    private final SpecialtyFieldService specialtyFieldService;
    private final StudentService studentService;
    private final StudentGroupService studentGroupService;
    private final StudentSciWorkService studentSciWorkService;
    private final StudentSciWorkTypeService studentSciWorkTypeService;
    private final SubjectService subjectService;
    private final TestingTypeService testingTypeService;
    private final TraineeshipService traineeshipService;
    private final TraineeshipTypeService traineeshipTypeService;
    private final Storage storage = new Storage();

    @GetMapping()
    public void fill() {
        // Simple entities
        eduFormService.create(storage.getEduForm());
        eduFundService.create(storage.getEduFund());
        lessonTypeService.create(storage.getLessonType());
        professorDegreeService.create(storage.getProfessorDegree());
        professorSciWorkTypeService.create(storage.getProfessorSciWorkType());
        studentSciWorkTypeService.create(storage.getStudentSciWorkType());
        testingTypeService.create(storage.getTestingType());
        traineeshipTypeService.create(storage.getTraineeshipType());
        scholarshipService.create(storage.getScholarship());
        subjectService.create(storage.getSubject());
        facultyService.create(storage.getFaculty());

        // Complex entities
        departmentService.create(storage.getDepartment());
        professorService.create(storage.getProfessor());
        specialtyService.create(storage.getSpecialty());
        specialtyFieldService.create(storage.getSpecialtyField());
        studentGroupService.create(storage.getStudentGroup());
        studentService.create(storage.getStudent());
        lessonService.create(storage.getLesson());
        professorSciWorkService.create(storage.getProfessorSciWork());
        studentSciWorkService.create(storage.getStudentSciWork());
        traineeshipService.create(storage.getTraineeship());
    }

}
