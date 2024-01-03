package com.megan.university.services.entities;

import com.megan.university.entities.TraineeshipProgress;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.TraineeshipProgressRepository;
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
public class TraineeshipProgressService {

    @PersistenceContext
    private EntityManager entityManager;
    private final TraineeshipProgressRepository traineeshipProgressRepository;

    // GET
    public EntityPage<TraineeshipProgress> getEntityPage(String orderBy, boolean isAscending, long studentGroupId, long studentId, long professorId, long traineeshipId, String passStatus, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<TraineeshipProgress> criteriaQuery = criteriaBuilder.createQuery(TraineeshipProgress.class);

        Root<TraineeshipProgress> traineeshipProgress = criteriaQuery.from(TraineeshipProgress.class);

        // Predicates
        List<Predicate> predicates = new ArrayList<>();

        if (studentGroupId > 0)
            predicates.add(criteriaBuilder.equal(traineeshipProgress.get("student").get("studentGroup").get("id"), studentGroupId));

        if (studentId > 0)
            predicates.add(criteriaBuilder.equal(traineeshipProgress.get("student").get("id"), studentId));

        if (professorId > 0)
            predicates.add(criteriaBuilder.equal(traineeshipProgress.get("traineeship").get("professor").get("id"), professorId));

        if (traineeshipId > 0)
            predicates.add(criteriaBuilder.equal(traineeshipProgress.get("traineeship").get("id"), traineeshipId));

        if (passStatus != null) {
            if (passStatus.equals("Passed"))
                predicates.add(criteriaBuilder.greaterThan(traineeshipProgress.get("finalScore"), 0));
            else if (passStatus.equals("Failed"))
                predicates.add(criteriaBuilder.equal(traineeshipProgress.get("finalScore"), 0));
        }

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            switch (orderBy) {
                case "First name":
                    criteriaQuery.orderBy(criteriaBuilder.asc(traineeshipProgress.get("student").get("firstName")));
                    break;
                case "Last name":
                    criteriaQuery.orderBy(criteriaBuilder.asc(traineeshipProgress.get("student").get("lastName")));
                    break;
                case "Traineeship":
                    criteriaQuery.orderBy(criteriaBuilder.asc(traineeshipProgress.get("traineeship").get("traineeshipType").get("type")));
                    break;
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.asc(traineeshipProgress.get("traineeship").get("professor").get("lastName")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.asc(traineeshipProgress.get(OrderValue.orderByParams.get(orderBy))));
            }
        else
            switch (orderBy) {
                case "First name":
                    criteriaQuery.orderBy(criteriaBuilder.desc(traineeshipProgress.get("student").get("firstName")));
                    break;
                case "Last name":
                    criteriaQuery.orderBy(criteriaBuilder.desc(traineeshipProgress.get("student").get("lastName")));
                    break;
                case "Traineeship":
                    criteriaQuery.orderBy(criteriaBuilder.desc(traineeshipProgress.get("traineeship").get("traineeshipType").get("type")));
                    break;
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.desc(traineeshipProgress.get("traineeship").get("professor").get("lastName")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.desc(traineeshipProgress.get(OrderValue.orderByParams.get(orderBy))));
            }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<TraineeshipProgress> traineeshipProgressRoot = countQuery.from(TraineeshipProgress.class);
        countQuery.select(criteriaBuilder.count(traineeshipProgressRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public TraineeshipProgress getExactTraineeshipProgress(TraineeshipProgress targetTraineeshipProgress) {
        return traineeshipProgressRepository.findOne(Example.of(
                targetTraineeshipProgress,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public TraineeshipProgress getById(long id) {
        Optional<TraineeshipProgress> traineeshipProgressOptional = traineeshipProgressRepository.findById(id);
        return traineeshipProgressOptional.orElse(null);
    }

    public long getTotalCount() {
        return traineeshipProgressRepository.count();
    }

    public List<TraineeshipProgress> getByStudentId(long studentId) {
        return traineeshipProgressRepository.findByStudent_Id(studentId);
    }

    // CREATE
    public TraineeshipProgress create(TraineeshipProgress traineeshipProgress) {
        if (traineeshipProgressRepository.findByStudent_IdAndTraineeship_Id(
                traineeshipProgress.getStudent().getId(),
                traineeshipProgress.getTraineeship().getId()) == null
        )
            return traineeshipProgressRepository.save(traineeshipProgress);
        else
            return null;
    }

    // UPDATE
    public TraineeshipProgress update(TraineeshipProgress traineeshipProgress) {
        if (traineeshipProgressRepository.existsTraineeshipProgressById(traineeshipProgress.getId()))
            return traineeshipProgressRepository.save(traineeshipProgress);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return traineeshipProgressRepository.deleteAllByIdIn(idArray);
    }

    public long deleteByStudentId(long studentId) {
        return traineeshipProgressRepository.deleteByStudent_Id(studentId);
    }

    public long deleteByStudentGroupId(long groupId) {
        return traineeshipProgressRepository.deleteByStudent_StudentGroup_Id(groupId);
    }

}
