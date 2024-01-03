package com.megan.university.services.entities;

import com.megan.university.entities.Department;
import com.megan.university.repositories.entities.DepartmentRepository;
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
public class DepartmentService {

    @PersistenceContext
    private EntityManager entityManager;
    private final DepartmentRepository departmentRepository;

    // GET
    public EntityPage<Department> getEntityPage(String orderBy, boolean isAscending, String name, long facultyId, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Department> criteriaQuery = criteriaBuilder.createQuery(Department.class);
        Root<Department> department = criteriaQuery.from(Department.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (name != null)
            predicates.add(criteriaBuilder.like(department.get("name"), "%" + name + "%"));

        if (facultyId > 0)
            predicates.add(criteriaBuilder.equal(department.get("faculty").get("id"), facultyId));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending) {
            if (orderBy.equals("Faculty"))
                criteriaQuery.orderBy(criteriaBuilder.asc(department.get("faculty").get("shortName")));
            else
                criteriaQuery.orderBy(criteriaBuilder.asc(department.get(OrderValue.orderByParams.get(orderBy))));
        } else {
            if (orderBy.equals("Faculty"))
                criteriaQuery.orderBy(criteriaBuilder.desc(department.get("faculty").get("shortName")));
            else
                criteriaQuery.orderBy(criteriaBuilder.desc(department.get(OrderValue.orderByParams.get(orderBy))));
        }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Department> departmentRoot = countQuery.from(Department.class);
        countQuery.select(criteriaBuilder.count(departmentRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public Department getExactDepartment(Department targetDepartment) {
        return departmentRepository.findOne(Example.of(
                targetDepartment,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public Department getById(long id) {
        Optional<Department> departmentOptional = departmentRepository.findById(id);
        return departmentOptional.orElse(null);
    }

    public long getTotalCount() {
        return departmentRepository.count();
    }

    public List<Department> getAll() {
        return departmentRepository.findAll();
    }

    public List<Department> getAllByFaculty(String facultyShortName) {
        return departmentRepository.findAllByFaculty_ShortName(facultyShortName);
    }

    // CREATE
    public Department create(Department department) {
        if (getExactDepartment(department) == null)
            return departmentRepository.save(department);
        else
            return null;
    }

    // UPDATE
    public Department update(Department department) {
        if (departmentRepository.existsDepartmentById(department.getId()))
            return departmentRepository.save(department);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return departmentRepository.deleteAllByIdIn(idArray);
    }

}
