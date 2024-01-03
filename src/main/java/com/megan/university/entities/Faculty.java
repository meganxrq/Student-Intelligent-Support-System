package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "faculties")
@Getter
@Setter
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "full_name", unique = true, nullable = false)
    private String fullName;

    @Column(name = "short_name", unique = true, nullable = false)
    private String shortName;

    public Faculty(String fullName, String shortName) {
        this.fullName = fullName;
        this.shortName = shortName;
    }

    public Faculty() {
    }
}
