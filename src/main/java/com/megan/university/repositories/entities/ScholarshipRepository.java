package com.megan.university.repositories.entities;

import com.megan.university.entities.Scholarship;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface ScholarshipRepository extends JpaRepository<Scholarship, Long> {

    Page<Scholarship> findAll(Pageable pageable);
    
    Optional<Scholarship> findById(long id);

    boolean existsScholarshipById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
