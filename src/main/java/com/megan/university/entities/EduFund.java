package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "education_funds")
@Getter
@Setter
public class EduFund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    public EduFund(String name) {
        this.name = name;
    }

    public EduFund() {
    }
}
