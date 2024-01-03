package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lessons")
@Getter
@Setter
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "id", nullable = false)
    private List<StudentGroup> studentGroup = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "testing_type_id", nullable = false)
    private TestingType testingType;

    @ManyToOne
    @JoinColumn(name = "lesson_type_id", nullable = false)
    private LessonType lessonType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "hour_count", nullable = false)
    private byte hourCount;

    public Lesson(
            Subject subject,
            Professor professor,
            List<StudentGroup> studentGroupList,
            TestingType testingType,
            LessonType lessonType,
            LocalDate startDate,
            LocalDate endDate,
            byte hourCount
    ) {
        this.subject = subject;
        this.professor = professor;
        this.studentGroup = studentGroupList;
        this.testingType = testingType;
        this.lessonType = lessonType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.hourCount = hourCount;
    }

    public Lesson() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Lesson lesson = (Lesson) o;
        return id == lesson.id;
    }

}
