package com.megan.university.services.entities;

import com.megan.university.entities.SpecialtyField;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.SpecialtyFieldRepository;
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
public class SpecialtyFieldService {

    @PersistenceContext
    private EntityManager entityManager;
    private final SpecialtyFieldRepository specialtyFieldRepository;

    // GET
    public EntityPage<SpecialtyField> getEntityPage(String orderBy, boolean isAscending, String name, String sCode, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<SpecialtyField> criteriaQuery = criteriaBuilder.createQuery(SpecialtyField.class);
        Root<SpecialtyField> specialtyField = criteriaQuery.from(SpecialtyField.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (name != null)
            predicates.add(criteriaBuilder.like(specialtyField.get("name"), "%" + name + "%"));

        if (sCode != null)
            predicates.add(criteriaBuilder.like(specialtyField.get("specialty").get("code"), "%" + sCode + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending) {
            if (!orderBy.equals("Specialty"))
                criteriaQuery.orderBy(criteriaBuilder.asc(specialtyField.get(OrderValue.orderByParams.get(orderBy))));
            else
                criteriaQuery.orderBy(criteriaBuilder.asc(specialtyField.get("specialty").get("name")));
        } else {
            if (!orderBy.equals("Specialty"))
                criteriaQuery.orderBy(criteriaBuilder.desc(specialtyField.get(OrderValue.orderByParams.get(orderBy))));
            else
                criteriaQuery.orderBy(criteriaBuilder.desc(specialtyField.get("specialty").get("name")));
        }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<SpecialtyField> specialtyFieldRoot = countQuery.from(SpecialtyField.class);
        countQuery.select(criteriaBuilder.count(specialtyFieldRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public SpecialtyField getExactSpecialtyField(SpecialtyField targetSpecialtyField) {
        return specialtyFieldRepository.findOne(Example.of(
                targetSpecialtyField,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public SpecialtyField getById(long id) {
        Optional<SpecialtyField> specialtyFieldOptional = specialtyFieldRepository.findById(id);
        return specialtyFieldOptional.orElse(null);
    }

    public long getTotalCount() {
        return specialtyFieldRepository.count();
    }

    public List<SpecialtyField> getAllBySpecialty(String specialtyCode) {
        return specialtyFieldRepository.findAllBySpecialty_Code(specialtyCode);
    }

    // CREATE
    public SpecialtyField create(SpecialtyField specialtyField) {
        if (getExactSpecialtyField(specialtyField) == null)
            return specialtyFieldRepository.save(specialtyField);
        else
            return null;
    }

    // UPDATE
    public SpecialtyField update(SpecialtyField specialtyField) {
        if (specialtyFieldRepository.existsSpecialtyFieldById(specialtyField.getId()))
            return specialtyFieldRepository.save(specialtyField);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return specialtyFieldRepository.deleteAllByIdIn(idArray);
    }

}
