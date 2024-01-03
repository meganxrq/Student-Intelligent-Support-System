package com.megan.university.repositories.entities;

import com.megan.university.entities.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    Page<Department> findAll(Pageable pageable);
    
    Optional<Department> findById(long id);

    List<Department> findAllByFaculty_ShortName(String facultyShortName);

    boolean existsDepartmentById(long id);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
