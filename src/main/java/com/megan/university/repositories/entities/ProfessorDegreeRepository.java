package com.megan.university.repositories.entities;

import com.megan.university.entities.ProfessorDegree;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface ProfessorDegreeRepository extends JpaRepository<ProfessorDegree, Long> {

    Page<ProfessorDegree> findAll(Pageable pageable);
    
    Optional<ProfessorDegree> findById(long id);

    boolean existsProfessorDegreeById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
