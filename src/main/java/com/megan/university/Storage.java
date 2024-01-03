package com.megan.university;

import com.megan.university.entities.*;
import com.megan.university.entities.*;
import lombok.Getter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
public class Storage {

    EduForm eduForm = new EduForm("Offline");
    EduFund eduFund = new EduFund("Budget");
    Faculty faculty = new Faculty("Information Technology Faculty", "IT Faculty");
    Subject subject = new Subject("Mathematics", "Maths");
    LessonType lessonType = new LessonType("Lecture");
    ProfessorDegree professorDegree = new ProfessorDegree("Doctor of Science");
    Scholarship scholarship = new Scholarship("Straight A", 100f);
    TestingType testingType = new TestingType("Exam");
    Specialty specialty = new Specialty("1.1.1", "Computer Science", "Bachelor", (byte) 4, faculty);
    SpecialtyField specialtyField = new SpecialtyField("Neural Network and AI Programming", specialty);
    Department department = new Department("Computer Science", faculty);
    Professor professor = new Professor("Male", "Alex", "Wong", department, professorDegree);
    StudentGroup studentGroup = new StudentGroup(3, specialtyField, eduForm, (short) 2022);
    Student student = new Student("Female", "Megan", "Xie", studentGroup, scholarship, eduFund);
    ProfessorSciWorkType professorSciWorkType = new ProfessorSciWorkType("Pictorial Essay");
    ProfessorSciWork professorSciWork = new ProfessorSciWork(professorSciWorkType, "AI Application for Student Lesson Schedule Optimization", "Passed", LocalDate.of(2022, 3, 23), professor);
    StudentSciWorkType studentSciWorkType = new StudentSciWorkType("Final Year Paper");
    StudentSciWork studentSciWork = new StudentSciWork(studentSciWorkType, "Student Intelligent Support System", "Passed", LocalDate.of(2024, 6, 14), student, professor);
    TraineeshipType traineeshipType = new TraineeshipType("Local Internship");

    List<StudentGroup> studentGroupList = new ArrayList<>();
    Lesson lesson;
    Traineeship traineeship;

    public Storage() {
        studentGroupList.add(studentGroup);
        traineeship = new Traineeship(traineeshipType, LocalDate.of(2020, 6, 29), LocalDate.of(2020, 7, 26), professor, studentGroupList);
        lesson = new Lesson(subject, professor, studentGroupList, testingType, lessonType, LocalDate.of(2020, 2, 13), LocalDate.of(2020, 5, 31), (byte) 24);
    }

}
