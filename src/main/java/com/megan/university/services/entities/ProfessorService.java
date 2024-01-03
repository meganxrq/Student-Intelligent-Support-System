package com.megan.university.services.entities;

import com.megan.university.entities.Professor;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.ProfessorRepository;
import com.megan.university.services.tools.OrderValue;
import com.megan.university.services.tools.UserInfoGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    @PersistenceContext
    private EntityManager entityManager;
    private final ProfessorRepository professorRepository;

    // GET
    public EntityPage<Professor> getEntityPage(String orderBy, boolean isAscending, String sex, String firstName, String lastName, long departmentId, long degreeId, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Professor> criteriaQuery = criteriaBuilder.createQuery(Professor.class);
        Root<Professor> professor = criteriaQuery.from(Professor.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (sex != null)
            predicates.add(criteriaBuilder.like(professor.get("sex"), sex));

        if (firstName != null)
            predicates.add(criteriaBuilder.like(professor.get("firstName"), "%" + firstName + "%"));

        if (lastName != null)
            predicates.add(criteriaBuilder.like(professor.get("lastName"), "%" + lastName + "%"));

        if (departmentId > 0)
            predicates.add(criteriaBuilder.equal(professor.get("department").get("id"), departmentId));

        if (degreeId > 0)
            predicates.add(criteriaBuilder.equal(professor.get("degree").get("id"), degreeId));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending) {
            if (!orderBy.equals("Faculty"))
                criteriaQuery.orderBy(criteriaBuilder.asc(professor.get(OrderValue.orderByParams.get(orderBy))));
            else
                criteriaQuery.orderBy(criteriaBuilder.asc(professor.get("department").get("faculty").get("shortName")));
        } else {
            if (!orderBy.equals("Faculty"))
                criteriaQuery.orderBy(criteriaBuilder.desc(professor.get(OrderValue.orderByParams.get(orderBy))));
            else
                criteriaQuery.orderBy(criteriaBuilder.desc(professor.get("department").get("faculty").get("shortName")));
        }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Professor> professorRoot = countQuery.from(Professor.class);
        countQuery.select(criteriaBuilder.count(professorRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public Professor getExactProfessor(Professor targetProfessor) {
        return professorRepository.findOne(Example.of(
                targetProfessor,
                ExampleMatcher.matching()
                        .withIgnorePaths("id", "login", "password", "role"))).orElse(null);
    }

    public Professor getById(long id) {
        return professorRepository.findById(id).orElse(null);
    }

    public long getTotalCount() {
        return professorRepository.count();
    }

    public List<Professor> getAllByDeptName(String departmentName) {
        return professorRepository.findAllByDepartment_Name(departmentName);
    }

    public String[] getCredentials(long professorId, Authentication auth) {
        Professor professor = getById(professorId);
        if (professor != null) {
            if (auth.getName().equals("Admin") || auth.getName().equals(professor.getUsername())) {
                return new String[]{
                        professor.getUsername(),
                        professor.getPassword()
                };
            }
        }
        return new String[]{};
    }

    // CREATE
    public Professor create(Professor professor) {
        if (getExactProfessor(professor) == null) {
            professor.setUserInfo(
                    UserInfoGenerator.getLogin("p"),
                    UserInfoGenerator.getPassword()
            );
            return professorRepository.save(professor);
        } else
            return null;
    }

    // UPDATE
    public Professor update(Professor professor) {
        Professor fromDB = getById(professor.getId());
        if (fromDB != null) {
            professor.setUsername(fromDB.getUsername());
            professor.setPassword(fromDB.getPassword());
            return professorRepository.save(professor);
        }
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return professorRepository.deleteAllByIdIn(idArray);
    }

}
