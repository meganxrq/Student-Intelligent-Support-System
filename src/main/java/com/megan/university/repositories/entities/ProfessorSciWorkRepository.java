package com.megan.university.repositories.entities;

import com.megan.university.entities.ProfessorSciWork;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface ProfessorSciWorkRepository extends JpaRepository<ProfessorSciWork, Long> {

    Page<ProfessorSciWork> findAll(Pageable pageable);
    
    Optional<ProfessorSciWork> findById(long id);

    boolean existsProfessorSciWorkById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
