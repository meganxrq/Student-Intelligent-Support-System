package com.megan.university.services.entities;

import com.megan.university.entities.StudentGroup;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.StudentGroupRepository;
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
public class StudentGroupService {

    @PersistenceContext
    private EntityManager entityManager;
    private final StudentGroupRepository studentGroupRepository;

    // GET
    public EntityPage<StudentGroup> getEntityPage(String orderBy, boolean isAscending, short startYear, int number, long fieldId, String program, long eduFormId, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentGroup> criteriaQuery = criteriaBuilder.createQuery(StudentGroup.class);
        Root<StudentGroup> studentGroup = criteriaQuery.from(StudentGroup.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (startYear > 0)
            predicates.add(criteriaBuilder.equal(studentGroup.get("startYear"), startYear));

        if (number > 0)
            predicates.add(criteriaBuilder.equal(studentGroup.get("number"), number));

        if (fieldId > 0)
            predicates.add(criteriaBuilder.equal(studentGroup.get("specialtyField").get("id"), fieldId));

        if (program != null)
            predicates.add(criteriaBuilder.like(studentGroup.get("specialtyField").get("specialty").get("program"), program));

        if (fieldId > 0)
            predicates.add(criteriaBuilder.equal(studentGroup.get("eduForm").get("id"), eduFormId));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending) {
            switch (orderBy) {
                case "Faculty":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentGroup.get("specialtyField").get("specialty").get("faculty").get("shortName")));
                    break;
                case "Program":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentGroup.get("specialtyField").get("specialty").get("program")));
                    break;
                case "Education form":
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentGroup.get("eduForm").get("name")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.asc(studentGroup.get(OrderValue.orderByParams.get(orderBy))));
            }
        } else {
            switch (orderBy) {
                case "Faculty":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentGroup.get("specialtyField").get("specialty").get("faculty").get("shortName")));
                    break;
                case "Program":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentGroup.get("specialtyField").get("specialty").get("program")));
                    break;
                case "Education form":
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentGroup.get("eduForm").get("name")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.desc(studentGroup.get(OrderValue.orderByParams.get(orderBy))));
            }
        }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<StudentGroup> studentGroupRoot = countQuery.from(StudentGroup.class);
        countQuery.select(criteriaBuilder.count(studentGroupRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public StudentGroup getExactStudentGroup(StudentGroup targetStudentGroup) {
        return studentGroupRepository.findOne(Example.of(
                targetStudentGroup,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public StudentGroup getById(long id) {
        Optional<StudentGroup> studentGroupOptional = studentGroupRepository.findById(id);
        return studentGroupOptional.orElse(null);
    }

    public long getTotalCount() {
        return studentGroupRepository.count();
    }

    public List<StudentGroup> getAll() {
        return studentGroupRepository.findAll();
    }

    // CREATE
    public StudentGroup create(StudentGroup studentGroup) {
        if (getExactStudentGroup(studentGroup) == null)
            return studentGroupRepository.save(studentGroup);
        else
            return null;
    }

    // UPDATE
    public StudentGroup update(StudentGroup studentGroup) {
        if (studentGroupRepository.existsStudentGroupById(studentGroup.getId()))
            return studentGroupRepository.save(studentGroup);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return studentGroupRepository.deleteAllByIdIn(idArray);
    }

}
