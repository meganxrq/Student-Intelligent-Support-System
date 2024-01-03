package com.megan.university.services.entities;

import com.megan.university.entities.TraineeshipType;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.TraineeshipTypeRepository;
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
public class TraineeshipTypeService {

    @PersistenceContext
    private EntityManager entityManager;
    private final TraineeshipTypeRepository traineeshipTypeRepository;

    // GET
    public EntityPage<TraineeshipType> getEntityPage(String orderBy, boolean isAscending, String type, Pageable pageable) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<TraineeshipType> criteriaQuery = criteriaBuilder.createQuery(TraineeshipType.class);
        Root<TraineeshipType> traineeshipType = criteriaQuery.from(TraineeshipType.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (type != null)
            predicates.add(criteriaBuilder.like(traineeshipType.get("type"), "%" + type + "%"));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            criteriaQuery.orderBy(criteriaBuilder.asc(traineeshipType.get(OrderValue.orderByParams.get(orderBy))));
        else
            criteriaQuery.orderBy(criteriaBuilder.desc(traineeshipType.get(OrderValue.orderByParams.get(orderBy))));

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<TraineeshipType> traineeshipTypeRoot = countQuery.from(TraineeshipType.class);
        countQuery.select(criteriaBuilder.count(traineeshipTypeRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public TraineeshipType getExactTraineeshipType(TraineeshipType targetTraineeshipType) {
        return traineeshipTypeRepository.findOne(Example.of(
                targetTraineeshipType,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public TraineeshipType getById(long id) {
        Optional<TraineeshipType> traineeshipTypeOptional = traineeshipTypeRepository.findById(id);
        return traineeshipTypeOptional.orElse(null);
    }

    public long getTotalCount() {
        return traineeshipTypeRepository.count();
    }

    public List<TraineeshipType> getAll() {
        return traineeshipTypeRepository.findAll();
    }

    // CREATE
    public TraineeshipType create(TraineeshipType traineeshipType) {
        if (getExactTraineeshipType(traineeshipType) == null)
            return traineeshipTypeRepository.save(traineeshipType);
        else
            return null;
    }

    // UPDATE
    public TraineeshipType update(TraineeshipType traineeshipType) {
        if (traineeshipTypeRepository.existsTraineeshipTypeById(traineeshipType.getId()))
            return traineeshipTypeRepository.save(traineeshipType);
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return traineeshipTypeRepository.deleteAllByIdIn(idArray);
    }

}
