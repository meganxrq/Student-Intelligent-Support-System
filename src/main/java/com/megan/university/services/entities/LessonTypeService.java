package com.megan.university.services.entities;

import com.megan.university.entities.LessonType;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.LessonTypeRepository;
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
public class LessonTypeService {

    @PersistenceContext
    private EntityManager entityManager;
    private final LessonTypeRepository lessonTypeRepository;

    // GET
    public EntityPage<LessonType> getEntityPage(String orderBy, boolean isAscending, String type, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<LessonType> criteriaQuery = criteriaBuilder.createQuery(LessonType.class);
        Root<LessonType> lessonType = criteriaQuery.from(LessonType.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (type != null)
            predicates.add(criteriaBuilder.like(lessonType.get("type"), "%" + type + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(lessonType.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(lessonType.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<LessonType> lessonTypeRoot = countQuery.from(LessonType.class);
        countQuery.select(criteriaBuilder.count(lessonTypeRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public LessonType getExactLessonType(LessonType targetLessonType) {
        return lessonTypeRepository.findOne(Example.of(
                targetLessonType,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public LessonType getById(long id) {
        Optional<LessonType> lessonTypeOptional = lessonTypeRepository.findById(id);
        return lessonTypeOptional.orElse(null);
    }

    public long getTotalCount() {
        return lessonTypeRepository.count();
    }

    public List<LessonType> getAll() {
        return lessonTypeRepository.findAll();
    }

    // CREATE
    public LessonType create(LessonType lessonType) {
        if (getExactLessonType(lessonType) == null)
            return lessonTypeRepository.save(lessonType);
        else
            return null;
    }

    // UPDATE
    public LessonType update(LessonType lessonType) {
        if (lessonTypeRepository.existsLessonTypeById(lessonType.getId()))
            return lessonTypeRepository.save(lessonType);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return lessonTypeRepository.deleteAllByIdIn(idArray);
    }

}
