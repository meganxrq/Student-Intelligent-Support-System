package com.megan.university.repositories.entities;

import com.megan.university.entities.StudentGroup;
import com.megan.university.entities.Traineeship;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface TraineeshipRepository extends JpaRepository<Traineeship, Long> {
    
    Optional<Traineeship> findById(long id);

    boolean existsTraineeshipById(long id);

    List<Traineeship> findByStudentGroupIn(List<StudentGroup> studentGroupList);
    List<Traineeship> findByStudentGroupInAndProfessor_Id(List<StudentGroup> studentGroupList, long professorId);

    List<Traineeship> findByProfessor_Id(long professorId);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
