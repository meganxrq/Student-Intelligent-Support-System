package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "traineeship_progress")
@Getter
@Setter
public class TraineeshipProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "traineeship_id", nullable = false)
    private Traineeship traineeship;

    @Column(name = "final_score")
    private byte finalScore;

    public TraineeshipProgress(Student student, Traineeship traineeship, byte finalScore) {
        this.student = student;
        this.traineeship = traineeship;
        this.finalScore = finalScore;
    }

    public TraineeshipProgress(Student student, Traineeship traineeship) {
        this.student = student;
        this.traineeship = traineeship;
    }

    public TraineeshipProgress() {
    }
}

