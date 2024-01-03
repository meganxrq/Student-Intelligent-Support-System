package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "specialties")
@Getter
@Setter
public class Specialty {

    @Id
    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Column(name = "program", nullable = false)
    private String program;

    @Column(name = "duration", nullable = false)
    private byte duration;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    public Specialty(String code, String name, String program, byte duration, Faculty faculty) {
        this.code = code;
        this.name = name;
        this.program = program;
        this.duration = duration;
        this.faculty = faculty;
    }

    public Specialty() {
    }
}
