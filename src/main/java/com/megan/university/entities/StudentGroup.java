package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "student_groups")
@Getter
@Setter
public class StudentGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "number", nullable = false)
    private int number;

    @ManyToOne
    @JoinColumn(name = "specialty_field_id", nullable = false)
    private SpecialtyField specialtyField;

    @ManyToOne
    @JoinColumn(name = "edu_form_id", nullable = false)
    private EduForm eduForm;

    @Column(name = "start_year", nullable = false)
    private short startYear;

    public StudentGroup(int number, SpecialtyField specialtyField, EduForm eduForm, short startYear) {
        this.number = number;
        this.specialtyField = specialtyField;
        this.eduForm = eduForm;
        this.startYear = startYear;
    }

    public StudentGroup() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        return id == ((StudentGroup) o).id;
    }

}
