package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "professor_sci_works")
@Getter
@Setter
public class ProfessorSciWork {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prof_sci_work_type_id", nullable = false)
    private ProfessorSciWorkType professorSciWorkType;

    @Column(name = "topic", nullable = false)
    private String topic;

    @Column(name = "defense_status")
    private String defenseStatus;

    @Column(name = "defense_date")
    private LocalDate defenseDate;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    public ProfessorSciWork(ProfessorSciWorkType professorSciWorkType, String topic, String defenseStatus, LocalDate defenseDate, Professor professor) {
        this.professorSciWorkType = professorSciWorkType;
        this.topic = topic;
        this.defenseStatus = defenseStatus;
        this.defenseDate = defenseDate;
        this.professor = professor;
    }

    public ProfessorSciWork() {
    }
}
