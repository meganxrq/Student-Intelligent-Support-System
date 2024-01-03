package com.megan.university.repositories.entities;

import com.megan.university.entities.Lesson;
import com.megan.university.entities.StudentGroup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    Page<Lesson> findAll(Pageable pageable);
    
    Optional<Lesson> findById(long id);

    List<Lesson> findByStudentGroupIn(List<StudentGroup> studentGroupList);
    List<Lesson> findByStudentGroupInAndProfessor_Id(List<StudentGroup> studentGroupList, long professorId);

    List<Lesson> findByProfessor_Id(long professorId);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

}
