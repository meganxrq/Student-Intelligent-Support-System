package com.megan.university.repositories.entities;

import com.megan.university.entities.TraineeshipProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface TraineeshipProgressRepository extends JpaRepository<TraineeshipProgress, Long> {

    Page<TraineeshipProgress> findAll(Pageable pageable);

    Optional<TraineeshipProgress> findById(long id);

    boolean existsTraineeshipProgressById(long id);

    List<TraineeshipProgress> findByStudent_Id(long studentId);

    TraineeshipProgress findByStudent_IdAndTraineeship_Id(long studentId, long traineeshipId);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

    @Transactional
    long deleteByStudent_Id(long studentId);

    @Transactional
    long deleteByStudent_StudentGroup_Id(long groupId);

}
