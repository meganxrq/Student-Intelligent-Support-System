package com.megan.university.services.entities;

import com.megan.university.entities.EduFund;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.EduFundRepository;
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
public class EduFundService {

    @PersistenceContext
    private EntityManager entityManager;
    private final EduFundRepository eduFundRepository;

    // GET
    public EntityPage<EduFund> getEntityPage(String orderBy, boolean isAscending, String name, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<EduFund> criteriaQuery = criteriaBuilder.createQuery(EduFund.class);
        Root<EduFund> eduFund = criteriaQuery.from(EduFund.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (name != null)
            predicates.add(criteriaBuilder.like(eduFund.get("name"), "%" + name + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(eduFund.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(eduFund.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<EduFund> eduFundRoot = countQuery.from(EduFund.class);
        countQuery.select(criteriaBuilder.count(eduFundRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public EduFund getExactEduFund(EduFund targetEduFund) {
        return eduFundRepository.findOne(Example.of(
                targetEduFund,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public EduFund getById(long id) {
        Optional<EduFund> eduFundOptional = eduFundRepository.findById(id);
        return eduFundOptional.orElse(null);
    }

    public long getTotalCount() {
        return eduFundRepository.count();
    }

    public List<EduFund> getAll() {
        return eduFundRepository.findAll();
    }

    // CREATE
    public EduFund create(EduFund eduFund) {
        if (getExactEduFund(eduFund) == null)
            return eduFundRepository.save(eduFund);
        else
            return null;
    }

    // UPDATE
    public EduFund update(EduFund eduFund) {
        if (eduFundRepository.existsEduFundById(eduFund.getId()))
            return eduFundRepository.save(eduFund);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return eduFundRepository.deleteAllByIdIn(idArray);
    }

}
