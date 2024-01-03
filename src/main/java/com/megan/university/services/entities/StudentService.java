package com.megan.university.services.entities;

import com.megan.university.entities.*;
import com.megan.university.models.EntityPage;
import com.megan.university.repositories.entities.LessonRepository;
import com.megan.university.repositories.entities.StudentRepository;
import com.megan.university.repositories.entities.TraineeshipRepository;
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
public class StudentService {

    @PersistenceContext
    private EntityManager entityManager;
    private final StudentRepository studentRepository;
    private final LessonRepository lessonRepository;
    private final TraineeshipRepository traineeshipRepository;
    private final StudentProgressService studentProgressService;
    private final TraineeshipProgressService traineeshipProgressService;

    // GET
    public EntityPage<Student> getEntityPage(
            String orderBy,
            boolean isAscending,
            String sex,
            String firstName,
            String lastName,
            String program,
            short startYear,
            long facultyId,
            int groupNumber,
            long eduFundId,
            long scholarshipId,
            Pageable pageable
    ) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Student> criteriaQuery = criteriaBuilder.createQuery(Student.class);
        Root<Student> student = criteriaQuery.from(Student.class);
        List<Predicate> predicates = new ArrayList<>();

        // Predicates
        if (sex != null)
            predicates.add(criteriaBuilder.like(student.get("sex"), sex));

        if (firstName != null)
            predicates.add(criteriaBuilder.like(student.get("firstName"), "%" + firstName + "%"));

        if (lastName != null)
            predicates.add(criteriaBuilder.like(student.get("lastName"), "%" + lastName + "%"));

        if (program != null)
            predicates.add(criteriaBuilder.like(student.get("studentGroup").get("specialtyField").get("specialty").get("program"), program));

        if (startYear > 0)
            predicates.add(criteriaBuilder.equal(student.get("studentGroup").get("startYear"), startYear));

        if (facultyId > 0)
            predicates.add(criteriaBuilder.equal(student.get("studentGroup").get("specialtyField").get("specialty").get("faculty").get("id"), facultyId));

        if (groupNumber > 0)
            predicates.add(criteriaBuilder.equal(student.get("studentGroup").get("number"), groupNumber));

        if (eduFundId > 0)
            predicates.add(criteriaBuilder.equal(student.get("eduFund").get("id"), eduFundId));

        if (scholarshipId > 0)
            predicates.add(criteriaBuilder.equal(student.get("scholarship").get("id"), scholarshipId));

        Predicate[] predicateArray = predicates.toArray(new Predicate[0]);
        criteriaQuery.where(predicateArray);

        // Order
        if (isAscending)
            switch (orderBy) {
                case "Program":
                    criteriaQuery.orderBy(criteriaBuilder.asc(student.get("studentGroup").get("specialtyField").get("specialty").get("program")));
                    break;
                case "Study start year":
                    criteriaQuery.orderBy(criteriaBuilder.asc(student.get("studentGroup").get("startYear")));
                    break;
                case "Faculty":
                    criteriaQuery.orderBy(criteriaBuilder.asc(student.get("studentGroup").get("specialtyField").get("specialty").get("faculty").get("shortName")));
                    break;
                case "Group №":
                    criteriaQuery.orderBy(criteriaBuilder.asc(student.get("studentGroup").get("number")));
                    break;
                case "Education fund":
                    criteriaQuery.orderBy(criteriaBuilder.asc(student.get("eduFund").get("name")));
                    break;
                case "Scholarship":
                    criteriaQuery.orderBy(criteriaBuilder.asc(student.get("scholarship").get("amount")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.asc(student.get(OrderValue.orderByParams.get(orderBy))));
            }
        else
            switch (orderBy) {
                case "Program":
                    criteriaQuery.orderBy(criteriaBuilder.desc(student.get("studentGroup").get("specialtyField").get("specialty").get("program")));
                    break;
                case "Study start year":
                    criteriaQuery.orderBy(criteriaBuilder.desc(student.get("studentGroup").get("startYear")));
                    break;
                case "Faculty":
                    criteriaQuery.orderBy(criteriaBuilder.desc(student.get("studentGroup").get("specialtyField").get("specialty").get("faculty").get("shortName")));
                    break;
                case "Group №":
                    criteriaQuery.orderBy(criteriaBuilder.desc(student.get("studentGroup").get("number")));
                    break;
                case "Education fund":
                    criteriaQuery.orderBy(criteriaBuilder.desc(student.get("eduFund").get("name")));
                    break;
                case "Scholarship":
                    criteriaQuery.orderBy(criteriaBuilder.desc(student.get("scholarship").get("amount")));
                    break;
                default:
                    criteriaQuery.orderBy(criteriaBuilder.desc(student.get(OrderValue.orderByParams.get(orderBy))));
            }

        // Total count
        CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
        Root<Student> studentRoot = countQuery.from(Student.class);
        countQuery.select(criteriaBuilder.count(studentRoot)).where(criteriaBuilder.and(predicateArray));

        return new EntityPage<>(
                entityManager.createQuery(criteriaQuery)
                        .setFirstResult((int) pageable.getOffset())
                        .setMaxResults(pageable.getPageSize())
                        .getResultList(),
                entityManager.createQuery(countQuery).getSingleResult()
        );

    }

    public Student getExactStudent(Student targetStudent) {
        return studentRepository.findOne(Example.of(
                targetStudent,
                ExampleMatcher.matching()
                        .withIgnorePaths("id"))).orElse(null);
    }

    public Student getById(long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public long getTotalCount() {
        return studentRepository.count();
    }

    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    public List<Student> getAllByGroupId(long groupId) {
        return studentRepository.findAllByStudentGroup_Id(groupId);
    }

    public String[] getCredentials(long studentId, Authentication auth) {
        Student student = getById(studentId);
        if (student != null) {
            if (auth.getName().equals("Admin") || auth.getName().equals(student.getUsername())) {
                return new String[]{
                        student.getUsername(),
                        student.getPassword()
                };
            }
        }
        return new String[]{};
    }

    // CREATE
    public Student create(Student student) {
        if (getExactStudent(student) == null) {
            student.setUserInfo(
                    UserInfoGenerator.getLogin("s"),
                    UserInfoGenerator.getPassword()
            );
            // Create new student to get his ID
            Student newStudent = studentRepository.save(student);
            // Create progress records
            linkLessonsAndTraineeshipsToStudentAndCreateProgress(newStudent, true);
            return newStudent;
        }
        return null;
    }

    // UPDATE
    public Student update(Student student) {
        Student fromDB = getById(student.getId());
        if (fromDB != null) {
            student.setUsername(fromDB.getUsername());
            student.setPassword(fromDB.getPassword());
            if (student.getStudentGroup().getId() == fromDB.getStudentGroup().getId()) {
                // If group hasn't been changed
                return studentRepository.save(student);
            } else { // Group has been changed
                // Create new student to get his ID
                Student newStudent = studentRepository.save(student);
                // Create progress records
                linkLessonsAndTraineeshipsToStudentAndCreateProgress(newStudent, false);
                return newStudent;
            }
        }
        return null;
    }

    // DELETE
    public long deleteByIds(long[] idArray) {
        return studentRepository.deleteAllByIdIn(idArray);
    }

    // MISCELLANIES
    // Link lessons to student
    private void linkLessonsAndTraineeshipsToStudentAndCreateProgress(Student student, boolean isCreated) {
        List<StudentGroup> studentGroupList = new ArrayList<>();
        studentGroupList.add(student.getStudentGroup());
        // Get list of group's lessons to pass
        List<Lesson> newLessonList = lessonRepository.findByStudentGroupIn(studentGroupList);
        // Get list of group's traineeships to pass
        List<Traineeship> newTraineeshipList = traineeshipRepository.findByStudentGroupIn(studentGroupList);

        if (!isCreated) { // If the student is being updated
            // Get list of previous progress of the student
            List<StudentProgress> oldProgressList = studentProgressService.getByStudentId(student.getId());
            // Make a list of old lessons
            List<Lesson> oldLessons = new ArrayList<>();
            for (StudentProgress oldProgress : oldProgressList) {
                oldLessons.add(oldProgress.getLesson());
            }
            // Remove all 'new' lessons that student already learns
            newLessonList.removeAll(oldLessons);

            // Get list of previous traineeships of the student
            List<TraineeshipProgress> oldTraineeshipList = traineeshipProgressService.getByStudentId(student.getId());
            // Make a list of old traineeships
            List<Traineeship> oldTraineeships = new ArrayList<>();
            for (TraineeshipProgress old : oldTraineeshipList) {
                oldTraineeships.add(old.getTraineeship());
            }
            // Remove all 'new' traineeships that student already learns
            newTraineeshipList.removeAll(oldTraineeships);
        }

        // Create progress records with the student and each lesson
        for (Lesson lesson : newLessonList) {
            studentProgressService.create(
                    new StudentProgress(student, lesson)
            );
        }

        // Create progress records with the student and each traineeship
        for (Traineeship traineeship : newTraineeshipList) {
            traineeshipProgressService.create(
                    new TraineeshipProgress(student, traineeship)
            );
        }
    }

}
