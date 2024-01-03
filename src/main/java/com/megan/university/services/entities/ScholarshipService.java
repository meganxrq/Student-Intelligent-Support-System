package com.megan.university.services.entities;

import com.megan.university.entities.Scholarship;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.ScholarshipRepository;
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
public class ScholarshipService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ScholarshipRepository scholarshipRepository;

    // GET
    public EntityPage<Scholarship> getEntityPage(String orderBy, boolean isAscending, String type, String amount, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Scholarship> criteriaQuery = criteriaBuilder.createQuery(Scholarship.class);
        Root<Scholarship> scholarship = criteriaQuery.from(Scholarship.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (type != null)
            predicates.add(criteriaBuilder.like(scholarship.get("type"), "%" + type + "%"));

        if (amount != null)
            predicates.add(criteriaBuilder.like(scholarship.get("amount").as(String.class), amount));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(scholarship.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(scholarship.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Scholarship> scholarshipRoot = countQuery.from(Scholarship.class);
        countQuery.select(criteriaBuilder.count(scholarshipRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public Scholarship getExactScholarship(Scholarship targetScholarship) {
        return scholarshipRepository.findOne(Example.of(
                targetScholarship,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public Scholarship getById(long id) {
        Optional<Scholarship> scholarshipOptional = scholarshipRepository.findById(id);
        return scholarshipOptional.orElse(null);
    }

    public long getTotalCount() {
        return scholarshipRepository.count();
    }

    public List<Scholarship> getAll() {
        return scholarshipRepository.findAll();
    }

    // CREATE
    public Scholarship create(Scholarship scholarship) {
        if (getExactScholarship(scholarship) == null)
            return scholarshipRepository.save(scholarship);
        else
            return null;
    }

    // UPDATE
    public Scholarship update(Scholarship scholarship) {
        if (scholarshipRepository.existsScholarshipById(scholarship.getId()))
            return scholarshipRepository.save(scholarship);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return scholarshipRepository.deleteAllByIdIn(idArray);
    }

}
