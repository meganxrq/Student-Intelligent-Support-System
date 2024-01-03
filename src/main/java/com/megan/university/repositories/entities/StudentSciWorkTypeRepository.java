package com.megan.university.repositories.entities;

import com.megan.university.entities.StudentSciWorkType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface StudentSciWorkTypeRepository extends JpaRepository<StudentSciWorkType, Long> {

    Page<StudentSciWorkType> findAll(Pageable pageable);

    Optional<StudentSciWorkType> findById(long id);

    boolean existsStudentSciWorkTypeById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
