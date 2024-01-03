package com.megan.university.repositories.entities;

import com.megan.university.entities.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Page<Student> findAll(Pageable pageable);
    
    Optional<Student> findById(long id);

    List<Student> findAllByStudentGroup_Id(long groupId);

    Optional<Student> findStudentByUsernameEquals(String login);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
