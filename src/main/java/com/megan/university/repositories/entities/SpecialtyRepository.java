package com.megan.university.repositories.entities;

import com.megan.university.entities.Specialty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {

    Page<Specialty> findAll(Pageable pageable);
    
    Optional<Specialty> findByCode(String code);

    List<Specialty> findAllByFaculty_ShortName(String facultyShortName);

    boolean existsSpecialtyByCode(String code);

    @Transactional
    long deleteAllByCodeIn(String[] codeArray);

}
