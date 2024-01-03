package com.megan.university.controllers.entities;

import com.megan.university.entities.StudentSciWork;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.StudentSciWorkService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/studentSciWork")
@RequiredArgsConstructor
public class StudentSciWorkController {

    private final StudentSciWorkService studentSciWorkService;

    @GetMapping()
    public EntityPage<StudentSciWork> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "groupId", required = false, defaultValue = "0") long groupId,
            @RequestParam(value = "studentId", required = false, defaultValue = "0") long studentId,
            @RequestParam(value = "facultyId", required = false, defaultValue = "0") long facultyId,
            @RequestParam(value = "deptId", required = false, defaultValue = "0") long departmentId,
            @RequestParam(value = "profId", required = false, defaultValue = "0") long professorId,
            @RequestParam(value = "workTypeId", required = false, defaultValue = "0") long studentSciWorkTypeId,
            @RequestParam(value = "topic", required = false) String topic,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "date", required = false) String date,
            Pageable pageable
    ) {
        return studentSciWorkService.getEntityPage(
                orderBy,
                isAscending,
                groupId,
                studentId,
                facultyId,
                departmentId,
                professorId,
                studentSciWorkTypeId,
                topic,
                status,
                date,
                pageable);
    }

    @GetMapping("/getById/{id}")
    public StudentSciWork getById(@PathVariable long id) {
        return studentSciWorkService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return studentSciWorkService.getTotalCount();
    }

    // CREATE
    @PostMapping()
    public StudentSciWork create(@RequestBody StudentSciWork studentSciWork) {
        return studentSciWorkService.create(studentSciWork);
    }

    // UPDATE
    @PutMapping()
    public StudentSciWork update(@RequestBody StudentSciWork studentSciWork) {
        return studentSciWorkService.update(studentSciWork);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return studentSciWorkService.deleteByIds(idArray);
    }

}
