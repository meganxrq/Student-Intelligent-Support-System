package com.megan.university.repositories.entities;

import com.megan.university.entities.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Page<Subject> findAll(Pageable pageable);
    
    Optional<Subject> findById(long id);

    boolean existsSubjectById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
