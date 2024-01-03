package com.megan.university.repositories.entities;

import com.megan.university.entities.StudentGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface StudentGroupRepository extends JpaRepository<StudentGroup, Long> {

    Page<StudentGroup> findAll(Pageable pageable);
    
    Optional<StudentGroup> findById(long id);

    boolean existsStudentGroupById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
