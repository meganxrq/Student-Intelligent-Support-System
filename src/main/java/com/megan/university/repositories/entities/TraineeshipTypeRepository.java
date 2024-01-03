package com.megan.university.repositories.entities;

import com.megan.university.entities.TraineeshipType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface TraineeshipTypeRepository extends JpaRepository<TraineeshipType, Long> {

    Page<TraineeshipType> findAll(Pageable pageable);
    
    Optional<TraineeshipType> findById(long id);

    boolean existsTraineeshipTypeById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
