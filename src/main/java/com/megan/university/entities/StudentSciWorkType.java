package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "student_sci_work_types")
@Getter
@Setter
public class StudentSciWorkType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "type", unique = true, nullable = false)
    private String type;

    public StudentSciWorkType(String type) {
        this.type = type;
    }

    public StudentSciWorkType() {
    }

}
