package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "specialty_fields")
@Getter
@Setter
public class SpecialtyField {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "specialty_id", nullable = false)
    private Specialty specialty;

    public SpecialtyField(String name, Specialty specialty) {
        this.name = name;
        this.specialty = specialty;
    }

    public SpecialtyField() {
    }
}
