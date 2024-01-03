package com.megan.university.repositories.entities;

import com.megan.university.entities.Faculty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Page<Faculty> findAll(Pageable pageable);
    
    Optional<Faculty> findById(long id);

    boolean existsFacultyById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

    Faculty findFirstByOrderByIdDesc();

}
