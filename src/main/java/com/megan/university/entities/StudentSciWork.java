package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "student_sci_works")
@Getter
@Setter
public class StudentSciWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "stud_sci_work_type_id", nullable = false)
    private StudentSciWorkType studentSciWorkType;

    @Column(name = "topic", nullable = false)
    private String topic;

    @Column(name = "defense_status")
    private String defenseStatus;

    @Column(name = "defense_date")
    private LocalDate defenseDate;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    public StudentSciWork(StudentSciWorkType studentSciWorkType, String topic, String defenseStatus, LocalDate defenseDate, Student student, Professor professor) {
        this.studentSciWorkType = studentSciWorkType;
        this.topic = topic;
        this.defenseStatus = defenseStatus;
        this.defenseDate = defenseDate;
        this.student = student;
        this.professor = professor;
    }

    public StudentSciWork() {
    }

}
