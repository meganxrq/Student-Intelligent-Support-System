package com.megan.university.services.entities;

import com.megan.university.entities.StudentSciWorkType;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.StudentSciWorkTypeRepository;
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
public class StudentSciWorkTypeService {

    @PersistenceContext
    private EntityManager entityManager;
    private final StudentSciWorkTypeRepository studentSciWorkTypeRepository;

    // GET
    public EntityPage<StudentSciWorkType> getEntityPage(String orderBy, boolean isAscending, String type, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<StudentSciWorkType> criteriaQuery = criteriaBuilder.createQuery(StudentSciWorkType.class);
        Root<StudentSciWorkType> studentSciWorkType = criteriaQuery.from(StudentSciWorkType.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (type != null)
            predicates.add(criteriaBuilder.like(studentSciWorkType.get("type"), "%" + type + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(studentSciWorkType.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(studentSciWorkType.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<StudentSciWorkType> studentSciWorkTypeRoot = countQuery.from(StudentSciWorkType.class);
        countQuery.select(criteriaBuilder.count(studentSciWorkTypeRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public StudentSciWorkType getExactStudentSciWorkType(StudentSciWorkType targetStudentSciWorkType) {
        return studentSciWorkTypeRepository.findOne(Example.of(
                targetStudentSciWorkType,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public StudentSciWorkType getById(long id) {
        Optional<StudentSciWorkType> studentSciWorkTypeOptional = studentSciWorkTypeRepository.findById(id);
        return studentSciWorkTypeOptional.orElse(null);
    }

    public long getTotalCount() {
        return studentSciWorkTypeRepository.count();
    }

    public List<StudentSciWorkType> getAll() {
        return studentSciWorkTypeRepository.findAll();
    }

    // CREATE
    public StudentSciWorkType create(StudentSciWorkType studentSciWorkType) {
        if (getExactStudentSciWorkType(studentSciWorkType) == null)
            return studentSciWorkTypeRepository.save(studentSciWorkType);
        else
            return null;
    }

    // UPDATE
    public StudentSciWorkType update(StudentSciWorkType studentSciWorkType) {
        if (studentSciWorkTypeRepository.existsStudentSciWorkTypeById(studentSciWorkType.getId()))
            return studentSciWorkTypeRepository.save(studentSciWorkType);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return studentSciWorkTypeRepository.deleteAllByIdIn(idArray);
    }

}
