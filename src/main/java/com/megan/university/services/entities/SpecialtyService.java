package com.megan.university.services.entities;

import com.megan.university.entities.Specialty;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.SpecialtyRepository;
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
public class SpecialtyService {

    @PersistenceContext
    private EntityManager entityManager;
    private final SpecialtyRepository specialtyRepository;

    // GET
    public EntityPage<Specialty> getEntityPage(String orderBy, boolean isAscending, String code, String name, long facultyId, String program, byte duration, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Specialty> criteriaQuery = criteriaBuilder.createQuery(Specialty.class);
        Root<Specialty> specialty = criteriaQuery.from(Specialty.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (code != null)
            predicates.add(criteriaBuilder.like(specialty.get("code"), "%" + code + "%"));

        if (name != null)
            predicates.add(criteriaBuilder.like(specialty.get("name"), "%" + name + "%"));

        if (facultyId > 0)
            predicates.add(criteriaBuilder.equal(specialty.get("faculty").get("id"), facultyId));

        if (program != null)
            predicates.add(criteriaBuilder.like(specialty.get("program"), program));

        if (duration > 0)
            predicates.add(criteriaBuilder.equal(specialty.get("duration"), duration));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(specialty.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(specialty.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Specialty> specialtyRoot = countQuery.from(Specialty.class);
        countQuery.select(criteriaBuilder.count(specialtyRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public Specialty getExactSpecialty(Specialty targetSpecialty) {
        return specialtyRepository.findOne(Example.of(
                targetSpecialty,
                ExampleMatcher.matching()
                        .withIgnorePaths("code"))).orElse(null);
    }

    public Specialty getByCode(String code) {
        Optional<Specialty> specialtyOptional = specialtyRepository.findByCode(code);
        return specialtyOptional.orElse(null);
    }

    public long getTotalCount() {
        return specialtyRepository.count();
    }

    public List<Specialty> getAll() {
        return specialtyRepository.findAll();
    }

    public List<Specialty> getAllByFaculty(String shortName) {
        return specialtyRepository.findAllByFaculty_ShortName(shortName);
    }

    // CREATE
    public Specialty create(Specialty specialty) {
        if (getExactSpecialty(specialty) == null)
            return specialtyRepository.save(specialty);
        else
            return null;
    }

    // UPDATE
    public Specialty update(Specialty specialty) {
        if (specialtyRepository.existsSpecialtyByCode(specialty.getCode()))
            return specialtyRepository.save(specialty);
        return null;
    }

    // DELETE
    public long deleteByCodes(String[] codeArray) {
        return specialtyRepository.deleteAllByCodeIn(codeArray);
    }

}
