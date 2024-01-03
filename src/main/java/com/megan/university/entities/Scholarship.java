package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "scholarships")
@Getter
@Setter
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "type", unique = true, nullable = false)
    private String type;

    @Column(name = "amount", nullable = false)
    private float amount;

    public Scholarship(String type, float amount) {
        this.type = type;
        this.amount = amount;
    }

    public Scholarship() {
    }
}
