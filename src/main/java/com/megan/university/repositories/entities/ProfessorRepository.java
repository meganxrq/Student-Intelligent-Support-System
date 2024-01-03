package com.megan.university.repositories.entities;

import com.megan.university.entities.Professor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    Page<Professor> findAll(Pageable pageable);
    
    Optional<Professor> findById(long id);

    Optional<Professor> findProfessorByUsernameEquals(String login);

    List<Professor> findAllByDepartment_Name(String departmentName);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
