package com.megan.university.repositories.entities;

import com.megan.university.entities.StudentProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {

    Page<StudentProgress> findAll(Pageable pageable);
    
    Optional<StudentProgress> findById(long id);

    StudentProgress findByStudent_IdAndLesson_Id(long studentId, long LessonId);

    boolean existsStudentProgressById(long id);

    List<StudentProgress> findByStudent_Id(long studentId);

    @Transactional
    long deleteAllByIdIn(long[] idArray);

    @Transactional
    long deleteByStudent_Id(long studentId);

    @Transactional
    long deleteByStudent_StudentGroup_Id(long groupId);

}
