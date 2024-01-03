package com.megan.university.services.entities;

import com.megan.university.entities.Subject;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.SubjectRepository;
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
public class SubjectService {

    @PersistenceContext
    private EntityManager entityManager;
    private final SubjectRepository subjectRepository;

    // GET
    public EntityPage<Subject> getEntityPage(String orderBy, boolean isAscending, String fullName, String shortName, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Subject> criteriaQuery = criteriaBuilder.createQuery(Subject.class);
        Root<Subject> subject = criteriaQuery.from(Subject.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (fullName != null)
            predicates.add(criteriaBuilder.like(subject.get("fullName"), "%" + fullName + "%"));

        if (shortName != null)
            predicates.add(criteriaBuilder.like(subject.get("shortName"), "%" + shortName + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(subject.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(subject.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Subject> subjectRoot = countQuery.from(Subject.class);
        countQuery.select(criteriaBuilder.count(subjectRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public Subject getExactSubject(Subject targetSubject) {
        return subjectRepository.findOne(Example.of(
                targetSubject,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public Subject getById(long id) {
        Optional<Subject> subjectOptional = subjectRepository.findById(id);
        return subjectOptional.orElse(null);
    }

    public long getTotalCount() {
        return subjectRepository.count();
    }

    public List<Subject> getAll() {
        return subjectRepository.findAll();
    }

    // CREATE
    public Subject create(Subject subject) {
        if (getExactSubject(subject) == null)
            return subjectRepository.save(subject);
        else
            return null;
    }

    // UPDATE
    public Subject update(Subject subject) {
        if (subjectRepository.existsSubjectById(subject.getId()))
            return subjectRepository.save(subject);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return subjectRepository.deleteAllByIdIn(idArray);
    }

}
