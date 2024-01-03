package com.megan.university.repositories.entities;

import com.megan.university.entities.ProfessorSciWorkType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface ProfessorSciWorkTypeRepository extends JpaRepository<ProfessorSciWorkType, Long> {

    Page<ProfessorSciWorkType> findAll(Pageable pageable);

    Optional<ProfessorSciWorkType> findById(long id);

    boolean existsProfessorSciWorkTypeById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
