package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "professor_degrees")
@Getter
@Setter
public class ProfessorDegree {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    public ProfessorDegree(String name) {
        this.name = name;
    }

    public ProfessorDegree() {
    }
}
