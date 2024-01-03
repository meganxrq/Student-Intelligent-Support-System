package com.megan.university.services.entities;

import com.megan.university.entities.Student;
import com.megan.university.entities.StudentGroup;
import com.megan.university.entities.Traineeship;
import com.megan.university.entities.TraineeshipProgress;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.TraineeshipRepository;
import com.megan.university.services.tools.OrderValue;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TraineeshipService {

    @PersistenceContext
    private EntityManager entityManager;
    private final TraineeshipRepository traineeshipRepository;
    private final StudentGroupService studentGroupService;
    private final StudentService studentService;
    private final TraineeshipProgressService traineeshipProgressService;

    // GET
    public EntityPage<Traineeship> getEntityPage(
            String orderBy,
            boolean isAscending,
            long facultyId,
            long departmentId,
            long professorId,
            long studentGroupId,
            long traineeshipTypeId,
            String startDate,
            String endDate,
            Pageable pageable
    ) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Traineeship> criteriaQuery = criteriaBuilder.createQuery(Traineeship.class);

        Root<Traineeship> traineeship = criteriaQuery.from(Traineeship.class);
        traineeship.alias("t");

        // Predicates
        List<Predicate> predicates = new ArrayList<>();

        if (facultyId > 0)
            predicates.add(criteriaBuilder.equal(traineeship.get("professor").get("department").get("faculty").get("id"), facultyId));

        if (departmentId > 0)
            predicates.add(criteriaBuilder.equal(traineeship.get("professor").get("department").get("id"), departmentId));

        if (professorId > 0)
            predicates.add(criteriaBuilder.equal(traineeship.get("professor").get("id"), professorId));

        if (studentGroupId > 0)
            predicates.add(criteriaBuilder.equal(traineeship.join("studentGroup").get("id"), studentGroupId));

        if (traineeshipTypeId > 0)
            predicates.add(criteriaBuilder.equal(traineeship.get("traineeshipType").get("id"), traineeshipTypeId));

        if (startDate != null)
            predicates.add(criteriaBuilder.like(
                    criteriaBuilder.function("to_char", String.class, traineeship.get("startDate"), criteriaBuilder.literal("yyyy-MM-dd")),
                    startDate
            ));

        if (endDate != null)
            predicates.add(criteriaBuilder.like(
                    criteriaBuilder.function("to_char", String.class, traineeship.get("endDate"), criteriaBuilder.literal("yyyy-MM-dd")),
                    endDate
            ));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            switch (orderBy) {
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.asc(traineeship.get("professor").get("lastName")));
                    break;
                case "Type":
                    criteriaQuery.orderBy(criteriaBuilder.asc(traineeship.get("traineeshipType").get("type")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.asc(traineeship.get(OrderValue.orderByParams.get(orderBy))));
            }
        else
            switch (orderBy) {
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.desc(traineeship.get("professor").get("lastName")));
                    break;
                case "Type":
                    criteriaQuery.orderBy(criteriaBuilder.desc(traineeship.get("traineeshipType").get("type")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.desc(traineeship.get(OrderValue.orderByParams.get(orderBy))));
            }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Traineeship> traineeshipRoot = countQuery.from(Traineeship.class);
        traineeshipRoot.alias("t");

        Join<Traineeship, StudentGroup> studentGroupJoinRoot = traineeshipRoot.join("studentGroup");
        studentGroupJoinRoot.alias("generatedAlias0");

        countQuery.select(criteriaBuilder.countDistinct(traineeshipRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public Traineeship getExactTraineeship(Traineeship targetTraineeship) {
        return traineeshipRepository.findOne(Example.of(
                targetTraineeship,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public Traineeship getById(long id) {
        Optional<Traineeship> traineeshipOptional = traineeshipRepository.findById(id);
        return traineeshipOptional.orElse(null);
    }

    public long getTotalCount() {
        return traineeshipRepository.count();
    }

    public List<Traineeship> getAllByGroupId(long groupId) {
        List<StudentGroup> studentGroupList = new ArrayList<>();
        studentGroupList.add(studentGroupService.getById(groupId));
        return traineeshipRepository.findByStudentGroupIn(studentGroupList);
    }

    public List<Traineeship> getAllByGroupAndProfessor(long groupId, long profId) {
        List<StudentGroup> studentGroupList = new ArrayList<>();
        studentGroupList.add(studentGroupService.getById(groupId));
        return traineeshipRepository.findByStudentGroupInAndProfessor_Id(studentGroupList, profId);
    }

    public List<StudentGroup> getGroupsByProfessor(long profId) {
        List<Traineeship> traineeshipList = traineeshipRepository.findByProfessor_Id(profId);
        List<StudentGroup> groupList = new ArrayList<>();
        for (Traineeship traineeship : traineeshipList) {
            for (StudentGroup group : traineeship.getStudentGroup()) {
                if (!groupList.contains(group)) {
                    groupList.add(group);
                }
            }
        }
        return groupList;
    }

    // CREATE
    public Traineeship create(Traineeship traineeship) {
        if (getExactTraineeship(traineeship) == null) {
            Traineeship newTraineeship = traineeshipRepository.save(traineeship);

            // Create progress for each student of each group
            List<Student> studentList;
            for (StudentGroup group : newTraineeship.getStudentGroup()) { // Each group
                studentList = studentService.getAllByGroupId(group.getId());
                for (Student student : studentList) { // Each student of each group
                    traineeshipProgressService.create(
                            new TraineeshipProgress(student, newTraineeship)
                    );
                }
            }

            return newTraineeship;
        } else
            return null;
    }

    // UPDATE
    public Traineeship update(Traineeship newTraineeship) {
        Traineeship traineeshipFromDB = getById(newTraineeship.getId()); // old traineeship
        if (traineeshipFromDB != null) {
            // 1. Find non-changed groups
            List<StudentGroup> commonGroups = new ArrayList<>(traineeshipFromDB.getStudentGroup());
            commonGroups.retainAll(newTraineeship.getStudentGroup()); // contains common unchanged groups

            // 2. Find new added groups
            List<StudentGroup> newGroups = new ArrayList<>(newTraineeship.getStudentGroup());
            newGroups.removeAll(commonGroups); // contains new groups
            // Create newTraineeship in database
            newTraineeship = traineeshipRepository.save(newTraineeship);
            // Create progress for all student of each new group
            for (StudentGroup group : newGroups) { // each group
                for (Student student : studentService.getAllByGroupId(group.getId())) { // each student
                    traineeshipProgressService.create(
                            new TraineeshipProgress(student, newTraineeship)
                    );
                }
            }

            return newTraineeship;
        }
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return traineeshipRepository.deleteAllByIdIn(idArray);
    }

}
