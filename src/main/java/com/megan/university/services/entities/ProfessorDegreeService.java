package com.megan.university.services.entities;

import com.megan.university.entities.ProfessorDegree;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.ProfessorDegreeRepository;
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
public class ProfessorDegreeService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ProfessorDegreeRepository professorDegreeRepository;

    // GET
    public EntityPage<ProfessorDegree> getEntityPage(String orderBy, boolean isAscending, String name, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProfessorDegree> criteriaQuery = criteriaBuilder.createQuery(ProfessorDegree.class);
        Root<ProfessorDegree> professorDegree = criteriaQuery.from(ProfessorDegree.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (name != null)
            predicates.add(criteriaBuilder.like(professorDegree.get("name"), "%" + name + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(professorDegree.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(professorDegree.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<ProfessorDegree> professorDegreeRoot = countQuery.from(ProfessorDegree.class);
        countQuery.select(criteriaBuilder.count(professorDegreeRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public ProfessorDegree getExactProfessorDegree(ProfessorDegree targetProfessorDegree) {
        return professorDegreeRepository.findOne(Example.of(
                targetProfessorDegree,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public ProfessorDegree getById(long id) {
        Optional<ProfessorDegree> professorDegreeOptional = professorDegreeRepository.findById(id);
        return professorDegreeOptional.orElse(null);
    }

    public long getTotalCount() {
        return professorDegreeRepository.count();
    }

    public List<ProfessorDegree> getAll() {
        return professorDegreeRepository.findAll();
    }

    // CREATE
    public ProfessorDegree create(ProfessorDegree professorDegree) {
        if (getExactProfessorDegree(professorDegree) == null)
            return professorDegreeRepository.save(professorDegree);
        else
            return null;
    }

    // UPDATE
    public ProfessorDegree update(ProfessorDegree professorDegree) {
        if (professorDegreeRepository.existsProfessorDegreeById(professorDegree.getId()))
            return professorDegreeRepository.save(professorDegree);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return professorDegreeRepository.deleteAllByIdIn(idArray);
    }

}
