package com.megan.university.services.entities;

import com.megan.university.entities.ProfessorSciWorkType;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.ProfessorSciWorkTypeRepository;
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
public class ProfessorSciWorkTypeService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ProfessorSciWorkTypeRepository professorSciWorkTypeRepository;

    // GET
    public EntityPage<ProfessorSciWorkType> getEntityPage(String orderBy, boolean isAscending, String type, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProfessorSciWorkType> criteriaQuery = criteriaBuilder.createQuery(ProfessorSciWorkType.class);
        Root<ProfessorSciWorkType> professorSciWorkType = criteriaQuery.from(ProfessorSciWorkType.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (type != null)
            predicates.add(criteriaBuilder.like(professorSciWorkType.get("type"), "%" + type + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(professorSciWorkType.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(professorSciWorkType.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<ProfessorSciWorkType> professorSciWorkTypeRoot = countQuery.from(ProfessorSciWorkType.class);
        countQuery.select(criteriaBuilder.count(professorSciWorkTypeRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public ProfessorSciWorkType getExactProfessorSciWorkType(ProfessorSciWorkType targetProfessorSciWorkType) {
        return professorSciWorkTypeRepository.findOne(Example.of(
                targetProfessorSciWorkType,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public ProfessorSciWorkType getById(long id) {
        Optional<ProfessorSciWorkType> professorSciWorkTypeOptional = professorSciWorkTypeRepository.findById(id);
        return professorSciWorkTypeOptional.orElse(null);
    }

    public long getTotalCount() {
        return professorSciWorkTypeRepository.count();
    }

    public List<ProfessorSciWorkType> getAll() {
        return professorSciWorkTypeRepository.findAll();
    }

    // CREATE
    public ProfessorSciWorkType create(ProfessorSciWorkType professorSciWorkType) {
        if (getExactProfessorSciWorkType(professorSciWorkType) == null)
            return professorSciWorkTypeRepository.save(professorSciWorkType);
        else
            return null;
    }

    // UPDATE
    public ProfessorSciWorkType update(ProfessorSciWorkType professorSciWorkType) {
        if (professorSciWorkTypeRepository.existsProfessorSciWorkTypeById(professorSciWorkType.getId()))
            return professorSciWorkTypeRepository.save(professorSciWorkType);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return professorSciWorkTypeRepository.deleteAllByIdIn(idArray);
    }

}
