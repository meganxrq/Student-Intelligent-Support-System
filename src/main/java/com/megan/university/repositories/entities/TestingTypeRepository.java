package com.megan.university.repositories.entities;

import com.megan.university.entities.TestingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface TestingTypeRepository extends JpaRepository<TestingType, Long> {

    Page<TestingType> findAll(Pageable pageable);
    
    Optional<TestingType> findById(long id);

    boolean existsTestingTypeById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
