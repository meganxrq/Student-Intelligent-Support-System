package com.megan.university.services.entities;

import com.megan.university.entities.Faculty;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.FacultyRepository;
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
public class FacultyService {

    @PersistenceContext
    private EntityManager entityManager;
    private final FacultyRepository facultyRepository;

    // GET
    public EntityPage<Faculty> getEntityPage(String orderBy, boolean isAscending, String fullName, String shortName, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Faculty> criteriaQuery = criteriaBuilder.createQuery(Faculty.class);
        Root<Faculty> faculty = criteriaQuery.from(Faculty.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (fullName != null)
            predicates.add(criteriaBuilder.like(faculty.get("fullName"), "%" + fullName + "%"));

        if (shortName != null)
            predicates.add(criteriaBuilder.like(faculty.get("shortName"), "%" + shortName + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(faculty.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(faculty.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Faculty> facultyRoot = countQuery.from(Faculty.class);
        countQuery.select(criteriaBuilder.count(facultyRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public List<Faculty> getAll() {
        return facultyRepository.findAll();
    }

    public Faculty getExactFaculty(Faculty targetFaculty) {
        return facultyRepository.findOne(Example.of(
                targetFaculty,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public Faculty getById(long id) {
        Optional<Faculty> facultyOptional = facultyRepository.findById(id);
        return facultyOptional.orElse(null);
    }

    public long getTotalCount() {
        return facultyRepository.count();
    }

    public Faculty getFirst() {
        return facultyRepository.findFirstByOrderByIdDesc();
    }

    // CREATE
    public Faculty create(Faculty faculty) {
        if (getExactFaculty(faculty) == null)
            return facultyRepository.save(faculty);
        else
            return null;
    }

    // UPDATE
    public Faculty update(Faculty faculty) {
        if (facultyRepository.existsFacultyById(faculty.getId()))
            return facultyRepository.save(faculty);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return facultyRepository.deleteAllByIdIn(idArray);
    }

}
