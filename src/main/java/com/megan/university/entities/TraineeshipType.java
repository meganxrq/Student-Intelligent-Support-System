package com.megan.university.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "traineeship_types")
@Getter
@Setter
public class TraineeshipType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "type", unique = true, nullable = false)
    private String type;

    public TraineeshipType(String type) {
        this.type = type;
    }

    public TraineeshipType() {
    }
}
