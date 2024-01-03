package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "traineeships")
@Getter
@Setter
public class Traineeship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "traineeship_type_id", nullable = false)
    private TraineeshipType traineeshipType;

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    @JoinColumn(name = "id", nullable = false)
    private List<StudentGroup> studentGroup;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    public Traineeship(TraineeshipType traineeshipType, LocalDate startDate, LocalDate endDate, Professor professor, List<StudentGroup> studentGroup) {
        this.traineeshipType = traineeshipType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.professor = professor;
        this.studentGroup = studentGroup;
    }

    public Traineeship() {
    }
}
