package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "student_progress")
@Getter
@Setter
public class StudentProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "final_score")
    private byte finalScore;

    @Column(name = "current_score")
    private short currentScore;

    @Column(name = "miss_count")
    private byte missCount;

    public StudentProgress(Student student, Lesson lesson, byte finalScore, short currentScore, byte missCount) {
        this.student = student;
        this.lesson = lesson;
        this.finalScore = finalScore;
        this.currentScore = currentScore;
        this.missCount = missCount;
    }

    public StudentProgress(Student student, Lesson lesson) {
        this.student = student;
        this.lesson = lesson;
    }

    public StudentProgress() {
    }
}
