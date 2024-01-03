package com.megan.university.repositories.entities;

import com.megan.university.entities.StudentSciWork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface StudentSciWorkRepository extends JpaRepository<StudentSciWork, Long> {

    Page<StudentSciWork> findAll(Pageable pageable);
    
    Optional<StudentSciWork> findById(long id);

    boolean existsStudentSciWorkById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
