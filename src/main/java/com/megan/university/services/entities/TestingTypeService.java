package com.megan.university.services.entities;

import com.megan.university.entities.TestingType;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.TestingTypeRepository;
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
public class TestingTypeService {

    @PersistenceContext
    private EntityManager entityManager;
    private final TestingTypeRepository testingTypeRepository;

    // GET
    public EntityPage<TestingType> getEntityPage(String orderBy, boolean isAscending, String type, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<TestingType> criteriaQuery = criteriaBuilder.createQuery(TestingType.class);
        Root<TestingType> testingType = criteriaQuery.from(TestingType.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (type != null)
            predicates.add(criteriaBuilder.like(testingType.get("type"), "%" + type + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(testingType.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(testingType.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<TestingType> testingTypeRoot = countQuery.from(TestingType.class);
        countQuery.select(criteriaBuilder.count(testingTypeRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public TestingType getExactTestingType(TestingType targetTestingType) {
        return testingTypeRepository.findOne(Example.of(
                targetTestingType,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public TestingType getById(long id) {
        Optional<TestingType> testingTypeOptional = testingTypeRepository.findById(id);
        return testingTypeOptional.orElse(null);
    }

    public long getTotalCount() {
        return testingTypeRepository.count();
    }

    public List<TestingType> getAll() {
        return testingTypeRepository.findAll();
    }

    // CREATE
    public TestingType create(TestingType testingType) {
        if (getExactTestingType(testingType) == null)
            return testingTypeRepository.save(testingType);
        else
            return null;
    }

    // UPDATE
    public TestingType update(TestingType testingType) {
        if (testingTypeRepository.existsTestingTypeById(testingType.getId()))
            return testingTypeRepository.save(testingType);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return testingTypeRepository.deleteAllByIdIn(idArray);
    }

}
