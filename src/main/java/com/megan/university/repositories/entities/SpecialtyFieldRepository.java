package com.megan.university.repositories.entities;

import com.megan.university.entities.SpecialtyField;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface SpecialtyFieldRepository extends JpaRepository<SpecialtyField, Long> {

    Page<SpecialtyField> findAll(Pageable pageable);
    
    Optional<SpecialtyField> findById(long id);

    List<SpecialtyField> findAllBySpecialty_Code(String specialtyCode);

    boolean existsSpecialtyFieldById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
