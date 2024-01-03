package com.megan.university.repositories.entities;

import com.megan.university.entities.LessonType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface LessonTypeRepository extends JpaRepository<LessonType, Long> {

    Page<LessonType> findAll(Pageable pageable);
    
    Optional<LessonType> findById(long id);

    boolean existsLessonTypeById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
