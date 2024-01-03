package com.megan.university.services.entities;

import com.megan.university.entities.StudentProgress;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.StudentProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentProgressService {

    @PersistenceContext
    private EntityManager entityManager;
    private final StudentProgressRepository studentProgressRepository;

    // GET
    public EntityPage<StudentProgress> getEntityPage(String orderBy, boolean isAscending, long studentGroupId, long studentId, long professorId, long subjectId, long testingTypeId, long lessonTypeId, String passStatus, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentProgress> criteriaQuery = criteriaBuilder.createQuery(StudentProgress.class);

        Root<StudentProgress> studentProgress = criteriaQuery.from(StudentProgress.class);

        // Predicates
        List<Predicate> predicates = new ArrayList<>();

        if (studentGroupId > 0)
            predicates.add(criteriaBuilder.equal(studentProgress.get("student").get("studentGroup").get("id"), studentGroupId));

        if (studentId > 0)
            predicates.add(criteriaBuilder.equal(studentProgress.get("student").get("id"), studentId));

        if (professorId > 0)
            predicates.add(criteriaBuilder.equal(studentProgress.get("lesson").get("professor").get("id"), professorId));

        if (subjectId > 0)
            predicates.add(criteriaBuilder.equal(studentProgress.get("lesson").get("subject").get("id"), subjectId));

        if (testingTypeId > 0)
            predicates.add(criteriaBuilder.equal(studentProgress.get("lesson").get("testingType").get("id"), testingTypeId));

        if (lessonTypeId > 0)
            predicates.add(criteriaBuilder.equal(studentProgress.get("lesson").get("lessonType").get("id"), lessonTypeId));

        if (passStatus != null) {
            if (passStatus.equals("Passed"))
                predicates.add(criteriaBuilder.greaterThan(studentProgress.get("finalScore"), 0));
            else if (passStatus.equals("Failed"))
                predicates.add(criteriaBuilder.equal(studentProgress.get("finalScore"), 0));
        }

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            switch (orderBy) {
                case "First name":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentProgress.get("student").get("firstName")));
                    break;
                case "Last name":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentProgress.get("student").get("lastName")));
                    break;
                case "Subject":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentProgress.get("lesson").get("subject").get("shortName")));
                    break;
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentProgress.get("lesson").get("professor").get("lastName")));
                    break;
                case "Lesson type":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentProgress.get("lesson").get("lessonType").get("type")));
                    break;
                case "Testing type":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentProgress.get("lesson").get("testingType").get("type")));
                    break;
                case "Miss hours":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentProgress.get("missCount")));
                    break;
            }
        else
            switch (orderBy) {
                case "First name":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentProgress.get("student").get("firstName")));
                    break;
                case "Last name":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentProgress.get("student").get("lastName")));
                    break;
                case "Subject":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentProgress.get("lesson").get("subject").get("shortName")));
                    break;
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentProgress.get("lesson").get("professor").get("lastName")));
                    break;
                case "Lesson type":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentProgress.get("lesson").get("lessonType").get("type")));
                    break;
                case "Testing type":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentProgress.get("lesson").get("testingType").get("type")));
                    break;
                case "Miss hours":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentProgress.get("missCount")));
                    break;
            }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<StudentProgress> studentProgressRoot = countQuery.from(StudentProgress.class);
        countQuery.select(criteriaBuilder.count(studentProgressRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public StudentProgress getById(long id) {
        Optional<StudentProgress> studentProgressOptional = studentProgressRepository.findById(id);
        return studentProgressOptional.orElse(null);
    }

    public long getTotalCount() {
        return studentProgressRepository.count();
    }

    public List<StudentProgress> getByStudentId(long studentId) {
        return studentProgressRepository.findByStudent_Id(studentId);
    }

    // CREATE
    public StudentProgress create(StudentProgress studentProgress) {
        if (studentProgressRepository.findByStudent_IdAndLesson_Id(
                studentProgress.getStudent().getId(),
                studentProgress.getLesson().getId()) == null
        )
            return studentProgressRepository.save(studentProgress);
        else
            return null;
    }

    // UPDATE
    public StudentProgress update(StudentProgress studentProgress) {
        if (studentProgressRepository.existsStudentProgressById(studentProgress.getId()))
            return studentProgressRepository.save(studentProgress);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return studentProgressRepository.deleteAllByIdIn(idArray);
    }

    public long deleteByStudentId(long studentId) {
        return studentProgressRepository.deleteByStudent_Id(studentId);
    }

    public long deleteByStudentGroupId(long groupId) {
        return studentProgressRepository.deleteByStudent_StudentGroup_Id(groupId);
    }


}
