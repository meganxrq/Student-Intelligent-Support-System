package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "lesson_types")
@Getter
@Setter
public class LessonType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "type", unique = true, nullable = false)
    private String type;

    public LessonType(String type) {
        this.type = type;
    }

    public LessonType() {
    }

}
