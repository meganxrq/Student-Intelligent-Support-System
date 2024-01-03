package com.megan.university.controllers.entities;

import com.megan.university.entities.StudentProgress;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.StudentProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/studentProgress")
@RequiredArgsConstructor
public class StudentProgressController {

    private final StudentProgressService studentProgressService;

    @GetMapping()
    public EntityPage<StudentProgress> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "groupId", required = false, defaultValue = "0") long studentGroupId,
            @RequestParam(value = "studId", required = false, defaultValue = "0") long studentId,
            @RequestParam(value = "profId", required = false, defaultValue = "0") long professorId,
            @RequestParam(value = "subjId", required = false, defaultValue = "0") long subjectId,
            @RequestParam(value = "tTypeId", required = false, defaultValue = "0") long testingTypeId,
            @RequestParam(value = "lTypeId", required = false, defaultValue = "0") long lessonTypeId,
            @RequestParam(value = "pass", required = false) String passStatus,
            Pageable pageable
    ) {
        return studentProgressService.getEntityPage(orderBy, isAscending, studentGroupId, studentId, professorId, subjectId, testingTypeId, lessonTypeId, passStatus, pageable);
    }

    @GetMapping("/getById/{id}")
    public StudentProgress getById(@PathVariable long id) {
        return studentProgressService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return studentProgressService.getTotalCount();
    }

    // CREATE
    @PostMapping()
    public StudentProgress create(@RequestBody StudentProgress studentProgress) {
        return studentProgressService.create(studentProgress);
    }

    // UPDATE
    @PutMapping()
    public StudentProgress update(@RequestBody StudentProgress studentProgress) {
        return studentProgressService.update(studentProgress);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return studentProgressService.deleteByIds(idArray);
    }

}
