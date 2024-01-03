package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "testing_types")
@Getter
@Setter
public class TestingType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "type", unique = true, nullable = false)
    private String type;

    public TestingType(String type) {
        this.type = type;
    }

    public TestingType() {
    }

}
