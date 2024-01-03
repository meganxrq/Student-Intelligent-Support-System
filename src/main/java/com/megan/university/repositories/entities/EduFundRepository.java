package com.megan.university.repositories.entities;

import com.megan.university.entities.EduFund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

public interface EduFundRepository extends JpaRepository<EduFund, Long> {

    Page<EduFund> findAll(Pageable pageable);
    
    Optional<EduFund> findById(long id);

    boolean existsEduFundById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
