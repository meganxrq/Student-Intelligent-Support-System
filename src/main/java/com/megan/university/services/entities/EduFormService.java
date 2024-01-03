package com.megan.university.services.entities;

import com.megan.university.entities.EduForm;
import com.megan.university.repositories.entities.EduFormRepository;
import com.megan.university.models.EntityPage;
import com.megan.university.services.tools.OrderValue;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

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
public class EduFormService {

    @PersistenceContext
    private EntityManager entityManager;
    private final EduFormRepository eduFormRepository;

    // GET
    public EntityPage<EduForm> getEntityPage(String orderBy, boolean isAscending, String name, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<EduForm> criteriaQuery = criteriaBuilder.createQuery(EduForm.class);
        Root<EduForm> eduForm = criteriaQuery.from(EduForm.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (name != null)
            predicates.add(criteriaBuilder.like(eduForm.get("name"), "%" + name + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(eduForm.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(eduForm.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<EduForm> eduFormRoot = countQuery.from(EduForm.class);
        countQuery.select(criteriaBuilder.count(eduFormRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public EduForm getExactEduForm(EduForm targetEduForm) {
        return eduFormRepository.findOne(Example.of(
                targetEduForm,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public EduForm getById(long id) {
        Optional<EduForm> eduFormOptional = eduFormRepository.findById(id);
        return eduFormOptional.orElse(null);
    }

    public long getTotalCount() {
        return eduFormRepository.count();
    }

    public List<EduForm> getAll() {
        return eduFormRepository.findAll();
    }

    // CREATE
    public EduForm create(EduForm eduForm) {
        if (getExactEduForm(eduForm) == null)
            return eduFormRepository.save(eduForm);
        else
            return null;
    }

    // UPDATE
    public EduForm update(EduForm eduForm) {
        if (eduFormRepository.existsEduFormById(eduForm.getId()))
            return eduFormRepository.save(eduForm);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return eduFormRepository.deleteAllByIdIn(idArray);
    }

}
