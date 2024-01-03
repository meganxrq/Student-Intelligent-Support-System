package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "education_forms")
@Getter
@Setter
public class EduForm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    public EduForm(String name) {
        this.name = name;
    }

    public EduForm() {
    }
}
