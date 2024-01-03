package com.megan.university.repositories.entities;

import com.megan.university.entities.EduForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface EduFormRepository extends JpaRepository<EduForm, Long> {

    Page<EduForm> findAll(Pageable pageable);
    
    Optional<EduForm> findById(long id);

    boolean existsEduFormById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
