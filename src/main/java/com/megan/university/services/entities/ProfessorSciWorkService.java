package com.megan.university.services.entities;

import com.megan.university.entities.ProfessorSciWork;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.ProfessorSciWorkRepository;
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
public class ProfessorSciWorkService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ProfessorSciWorkRepository professorSciWorkRepository;

    // GET
    public EntityPage<ProfessorSciWork> getEntityPage(
            String orderBy,
            boolean isAscending,
            long facultyId,
            long departmentId,
            long professorId,
            long professorSciWorkTypeId,
            String topic,
            String status,
            String date,
            Pageable pageable
    ) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProfessorSciWork> criteriaQuery = criteriaBuilder.createQuery(ProfessorSciWork.class);
        Root<ProfessorSciWork> professorSciWork = criteriaQuery.from(ProfessorSciWork.class);

        // Predicates
        List<Predicate> predicates = new ArrayList<>();

        if (facultyId > 0)
            predicates.add(criteriaBuilder.equal(professorSciWork.get("professor").get("department").get("faculty").get("id"), facultyId));

        if (departmentId > 0)
            predicates.add(criteriaBuilder.equal(professorSciWork.get("professor").get("department").get("id"), departmentId));

        if (professorId > 0)
            predicates.add(criteriaBuilder.equal(professorSciWork.get("professor").get("id"), professorId));

        if (professorSciWorkTypeId > 0)
            predicates.add(criteriaBuilder.equal(professorSciWork.get("professorSciWorkType").get("id"), professorSciWorkTypeId));

        if (topic != null)
            predicates.add(criteriaBuilder.like(professorSciWork.get("topic"), "%" + topic + "%"));

        if (status != null)
            predicates.add(criteriaBuilder.like(professorSciWork.get("defenseStatus"), status));

        if (date != null)
            predicates.add(criteriaBuilder.like(
                    criteriaBuilder.function("to_char", String.class, professorSciWork.get("defenseDate"), criteriaBuilder.literal("yyyy-MM-dd")),
                    date
            ));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            switch (orderBy) {
                case "Faculty":
                    criteriaQuery.orderBy(criteriaBuilder.asc(professorSciWork.get("professor").get("department").get("faculty").get("shortName")));
                    break;
                case "Department":
                    criteriaQuery.orderBy(criteriaBuilder.asc(professorSciWork.get("professor").get("department").get("name")));
                    break;
                case "First name":
                    criteriaQuery.orderBy(criteriaBuilder.asc(professorSciWork.get("professor").get("firstName")));
                    break;
                case "Last name":
                    criteriaQuery.orderBy(criteriaBuilder.asc(professorSciWork.get("professor").get("lastName")));
                    break;
                case "Type":
                    criteriaQuery.orderBy(criteriaBuilder.asc(professorSciWork.get("professorSciWorkType").get("type")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.asc(professorSciWork.get(OrderValue.orderByParams.get(orderBy))));
            }
        else
            switch (orderBy) {
                case "Faculty":
                    criteriaQuery.orderBy(criteriaBuilder.desc(professorSciWork.get("professor").get("department").get("faculty").get("shortName")));
                    break;
                case "Department":
                    criteriaQuery.orderBy(criteriaBuilder.desc(professorSciWork.get("professor").get("department").get("name")));
                    break;
                case "First name":
                    criteriaQuery.orderBy(criteriaBuilder.desc(professorSciWork.get("professor").get("firstName")));
                    break;
                case "Last name":
                    criteriaQuery.orderBy(criteriaBuilder.desc(professorSciWork.get("professor").get("lastName")));
                    break;
                case "Type":
                    criteriaQuery.orderBy(criteriaBuilder.desc(professorSciWork.get("professorSciWorkType").get("type")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.desc(professorSciWork.get(OrderValue.orderByParams.get(orderBy))));
            }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<ProfessorSciWork> professorSciWorkRoot = countQuery.from(ProfessorSciWork.class);
        countQuery.select(criteriaBuilder.count(professorSciWorkRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public ProfessorSciWork getExactProfessorSciWork(ProfessorSciWork targetProfessorSciWork) {
        return professorSciWorkRepository.findOne(Example.of(
                targetProfessorSciWork,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public ProfessorSciWork getById(long id) {
        Optional<ProfessorSciWork> professorSciWorkOptional = professorSciWorkRepository.findById(id);
        return professorSciWorkOptional.orElse(null);
    }

    public long getTotalCount() {
        return professorSciWorkRepository.count();
    }

    // CREATE
    public ProfessorSciWork create(ProfessorSciWork professorSciWork) {
        if (getExactProfessorSciWork(professorSciWork) == null)
            return professorSciWorkRepository.save(professorSciWork);
        else
            return null;
    }

    // UPDATE
    public ProfessorSciWork update(ProfessorSciWork professorSciWork) {
        if (professorSciWorkRepository.existsProfessorSciWorkById(professorSciWork.getId()))
            return professorSciWorkRepository.save(professorSciWork);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return professorSciWorkRepository.deleteAllByIdIn(idArray);
    }

}
