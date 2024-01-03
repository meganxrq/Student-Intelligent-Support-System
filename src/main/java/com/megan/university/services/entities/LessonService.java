package com.megan.university.services.entities;

import com.megan.university.entities.Lesson;
import com.megan.university.entities.Student;
import com.megan.university.entities.StudentGroup;
import com.megan.university.entities.StudentProgress;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.LessonRepository;
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
public class LessonService {

    @PersistenceContext
    private EntityManager entityManager;
    private final LessonRepository lessonRepository;
    private final StudentService studentService;
    private final StudentProgressService studentProgressService;
    private final StudentGroupService studentGroupService;

    // GET
    public EntityPage<Lesson> getEntityPage(
            String orderBy,
            boolean isAscending,
            long departmentId,
            long professorId,
            long subjectId,
            long studentGroupId,
            long testingTypeId,
            long lessonTypeId,
            String startDate,
            String endDate,
            short hourCount,
            Pageable pageable
    ) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Lesson> criteriaQuery = criteriaBuilder.createQuery(Lesson.class);

        Root<Lesson> lesson = criteriaQuery.from(Lesson.class);
        lesson.alias("l");

        // Predicates
        List<Predicate> predicates = new ArrayList<>();

        if (departmentId > 0)
            predicates.add(criteriaBuilder.equal(lesson.get("professor").get("department").get("id"), departmentId));

        if (professorId > 0)
            predicates.add(criteriaBuilder.equal(lesson.get("professor").get("id"), professorId));

        if (subjectId > 0)
            predicates.add(criteriaBuilder.equal(lesson.get("subject").get("id"), subjectId));

        if (studentGroupId > 0)
            predicates.add(criteriaBuilder.equal(lesson.join("studentGroup").get("id"), studentGroupId));

        if (testingTypeId > 0)
            predicates.add(criteriaBuilder.equal(lesson.get("testingType").get("id"), testingTypeId));

        if (lessonTypeId > 0)
            predicates.add(criteriaBuilder.equal(lesson.get("lessonType").get("id"), lessonTypeId));

        if (startDate != null)
            predicates.add(criteriaBuilder.like(
                    criteriaBuilder.function("to_char", String.class, lesson.get("startDate"), criteriaBuilder.literal("yyyy-MM-dd")),
                    startDate
            ));

        if (endDate != null)
            predicates.add(criteriaBuilder.like(
                    criteriaBuilder.function("to_char", String.class, lesson.get("endDate"), criteriaBuilder.literal("yyyy-MM-dd")),
                    endDate
            ));

        if (hourCount > 0)
            predicates.add(criteriaBuilder.equal(lesson.get("hourCount"), hourCount));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            switch (orderBy) {
                case "Department":
                    criteriaQuery.orderBy(criteriaBuilder.asc(lesson.get("professor").get("department").get("name")));
                    break;
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.asc(lesson.get("professor").get("lastName")));
                    break;
                case "Subject":
                    criteriaQuery.orderBy(criteriaBuilder.asc(lesson.get("subject").get("shortName")));
                    break;
                case "Lesson type":
                    criteriaQuery.orderBy(criteriaBuilder.asc(lesson.get("lessonType").get("type")));
                    break;
                case "Testing type":
                    criteriaQuery.orderBy(criteriaBuilder.asc(lesson.get("testingType").get("type")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.asc(lesson.get(OrderValue.orderByParams.get(orderBy))));
            }
        else
            switch (orderBy) {
                case "Department":
                    criteriaQuery.orderBy(criteriaBuilder.desc(lesson.get("professor").get("department").get("name")));
                    break;
                case "Professor":
                    criteriaQuery.orderBy(criteriaBuilder.desc(lesson.get("professor").get("lastName")));
                    break;
                case "Subject":
                    criteriaQuery.orderBy(criteriaBuilder.desc(lesson.get("subject").get("shortName")));
                    break;
                case "Lesson type":
                    criteriaQuery.orderBy(criteriaBuilder.desc(lesson.get("lessonType").get("type")));
                    break;
                case "Testing type":
                    criteriaQuery.orderBy(criteriaBuilder.desc(lesson.get("testingType").get("type")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.desc(lesson.get(OrderValue.orderByParams.get(orderBy))));
            }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Lesson> lessonRoot = countQuery.from(Lesson.class);
        lessonRoot.alias("l");

        Join<Lesson, StudentGroup> studentGroupJoinRoot = lessonRoot.join("studentGroup");
        studentGroupJoinRoot.alias("generatedAlias0");

        countQuery.select(criteriaBuilder.countDistinct(lessonRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public Lesson getExactLesson(Lesson targetLesson) {
        return lessonRepository.findOne(Example.of(
                targetLesson,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public Lesson getById(long id) {
        Optional<Lesson> lessonOptional = lessonRepository.findById(id);
        return lessonOptional.orElse(null);
    }

    public long getTotalCount() {
        return lessonRepository.count();
    }

    public List<Lesson> getAllByGroupId(long groupId) {
        List<StudentGroup> studentGroupList = new ArrayList<>();
        studentGroupList.add(studentGroupService.getById(groupId));
        return lessonRepository.findByStudentGroupIn(studentGroupList);
    }

    public List<Lesson> getAllByGroupAndProfessor(long groupId, long profId) {
        List<StudentGroup> studentGroupList = new ArrayList<>();
        studentGroupList.add(studentGroupService.getById(groupId));
        return lessonRepository.findByStudentGroupInAndProfessor_Id(studentGroupList, profId);
    }

    public List<StudentGroup> getGroupsByProfessor(long profId) {
        List<Lesson> lessonList = lessonRepository.findByProfessor_Id(profId);
        List<StudentGroup> groupList = new ArrayList<>();
        for (Lesson lesson : lessonList) {
            for (StudentGroup group : lesson.getStudentGroup()) {
                if (!groupList.contains(group)) {
                    groupList.add(group);
                }
            }
        }
        return groupList;
    }

    // CREATE
    public Lesson create(Lesson lesson) {
        if (getExactLesson(lesson) == null) {
            Lesson newLesson = lessonRepository.save(lesson);

            // Create progress for each student of each group
            List<Student> studentList;
            for (StudentGroup group : newLesson.getStudentGroup()) { // Each group
                studentList = studentService.getAllByGroupId(group.getId());
                for (Student student : studentList) { // Each student of each group
                    studentProgressService.create(
                            new StudentProgress(student, newLesson)
                    );
                }
            }

            return newLesson;
        }
        return null;
    }

    // UPDATE
    public Lesson update(Lesson newLesson) {
        Lesson lessonFromDB = getById(newLesson.getId()); // old lesson
        if (lessonFromDB != null) {
            // 1. Find non-changed groups
            List<StudentGroup> commonGroups = new ArrayList<>(lessonFromDB.getStudentGroup());
            commonGroups.retainAll(newLesson.getStudentGroup()); // contains common unchanged groups

            /*// 2. Find deleted groups
            List<StudentGroup> removedGroups = new ArrayList<>(lessonFromDB.getStudentGroup());
            removedGroups.removeAll(commonGroups); // contains removed groups
            // Delete progress of each group's student
            for (StudentGroup group : removedGroups) {
                studentProgressService.deleteByStudentGroupId(group.getId());
            }*/

            // 3. Find new added groups
            List<StudentGroup> newGroups = new ArrayList<>(newLesson.getStudentGroup());
            newGroups.removeAll(commonGroups); // contains new groups
            // Create newLesson in database
            newLesson = lessonRepository.save(newLesson);
            // Create progress for all student of each new group
            for (StudentGroup group : newGroups) { // each group
                for (Student student : studentService.getAllByGroupId(group.getId())) { // each student
                    studentProgressService.create(
                            new StudentProgress(student, newLesson)
                    );
                }
            }

            return newLesson;
        }
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return lessonRepository.deleteAllByIdIn(idArray);
    }

}
