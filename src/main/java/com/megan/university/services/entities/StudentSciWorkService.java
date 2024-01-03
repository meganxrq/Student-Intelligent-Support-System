package com.megan.university.services.entities;

import com.megan.university.entities.StudentSciWork;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.StudentSciWorkRepository;
import com.megan.university.services.tools.OrderValue;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
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
public class StudentSciWorkService {

    @PersistenceContext
    private EntityManager entityManager;
    private final StudentSciWorkRepository studentSciWorkRepository;

    // GET
    public EntityPage<StudentSciWork> getEntityPage(
            String orderBy,
            boolean isAscending,
            long groupId,
            long studentId,
            long facultyId,
            long departmentId,
            long professorId,
            long studentSciWorkTypeId,
            String topic,
            String status,
            String date,
            Pageable pageable
    ) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentSciWork> criteriaQuery = criteriaBuilder.createQuery(StudentSciWork.class);
        Root<StudentSciWork> studentSciWork = criteriaQuery.from(StudentSciWork.class);

        // Predicates
        List<Predicate> predicates = new ArrayList<>();

        if (groupId > 0)
            predicates.add(criteriaBuilder.equal(studentSciWork.get("student").get("studentGroup").get("id"), groupId));

        if (studentId > 0)
            predicates.add(criteriaBuilder.equal(studentSciWork.get("student").get("id"), studentId));

        if (facultyId > 0)
            predicates.add(criteriaBuilder.equal(studentSciWork.get("professor").get("department").get("faculty").get("id"), facultyId));

        if (departmentId > 0)
            predicates.add(criteriaBuilder.equal(studentSciWork.get("professor").get("department").get("id"), departmentId));

        if (professorId > 0)
            predicates.add(criteriaBuilder.equal(studentSciWork.get("professor").get("id"), professorId));

        if (studentSciWorkTypeId > 0)
            predicates.add(criteriaBuilder.equal(studentSciWork.get("studentSciWorkType").get("id"), studentSciWorkTypeId));

        if (topic != null)
            predicates.add(criteriaBuilder.like(studentSciWork.get("topic"), "%" + topic + "%"));

        if (status != null)
            predicates.add(criteriaBuilder.like(studentSciWork.get("defenseStatus"), status));

        if (date != null)
            predicates.add(criteriaBuilder.like(
                    criteriaBuilder.function("to_char", String.class, studentSciWork.get("defenseDate"), criteriaBuilder.literal("yyyy-MM-dd")),
                    date
            ));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            switch (orderBy) {
                case "Study start year":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWork.get("student").get("studentGroup").get("startYear")));
                    break;
                case "Faculty":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWork.get("student").get("studentGroup").get("specialtyField").get("specialty").get("faculty").get("shortName")));
                    break;
                case "Group №":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWork.get("student").get("studentGroup").get("number")));
                    break;
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWork.get("professor").get("lastName")));
                    break;
                case "First name":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWork.get("student").get("firstName")));
                    break;
                case "Last name":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWork.get("student").get("lastName")));
                    break;
                case "Type":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWork.get("studentSciWorkType").get("type")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWork.get(OrderValue.orderByParams.get(orderBy))));
            }
        else
            switch (orderBy) {
                case "Study start year":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWork.get("student").get("studentGroup").get("startYear")));
                    break;
                case "Faculty":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWork.get("student").get("studentGroup").get("specialtyField").get("specialty").get("faculty").get("shortName")));
                    break;
                case "Group №":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWork.get("student").get("studentGroup").get("number")));
                    break;
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWork.get("professor").get("lastName")));
                    break;
                case "First name":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWork.get("student").get("firstName")));
                    break;
                case "Last name":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWork.get("student").get("lastName")));
                    break;
                case "Type":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWork.get("studentSciWorkType").get("type")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWork.get(OrderValue.orderByParams.get(orderBy))));
            }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<StudentSciWork> studentSciWorkRoot = countQuery.from(StudentSciWork.class);
        countQuery.select(criteriaBuilder.count(studentSciWorkRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public StudentSciWork getExactStudentSciWork(StudentSciWork targetStudentSciWork) {
        return studentSciWorkRepository.findOne(Example.of(
                targetStudentSciWork,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public StudentSciWork getById(long id) {
        Optional<StudentSciWork> studentSciWorkOptional = studentSciWorkRepository.findById(id);
        return studentSciWorkOptional.orElse(null);
    }

    public long getTotalCount() {
        return studentSciWorkRepository.count();
    }

    // CREATE
    public StudentSciWork create(StudentSciWork studentSciWork) {
        if (getExactStudentSciWork(studentSciWork) == null)
            return studentSciWorkRepository.save(studentSciWork);
        else
            return null;
    }

    // UPDATE
    public StudentSciWork update(StudentSciWork studentSciWork) {
        if (studentSciWorkRepository.existsStudentSciWorkById(studentSciWork.getId()))
            return studentSciWorkRepository.save(studentSciWork);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return studentSciWorkRepository.deleteAllByIdIn(idArray);
    }

}
