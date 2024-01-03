package com.megan.university.controllers.entities;

import com.megan.university.entities.Lesson;
import com.megan.university.entities.StudentGroup;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/lesson")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping()
    public EntityPage<Lesson> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "deptId", required = false, defaultValue = "0") long departmentId,
            @RequestParam(value = "profId", required = false, defaultValue = "0") long professorId,
            @RequestParam(value = "subjId", required = false, defaultValue = "0") long subjectId,
            @RequestParam(value = "groupId", required = false, defaultValue = "0") long studentGroupId,
            @RequestParam(value = "tTypeId", required = false, defaultValue = "0") long testingTypeId,
            @RequestParam(value = "lTypeId", required = false, defaultValue = "0") long lessonTypeId,
            @RequestParam(value = "sDate", required = false) String startDate,
            @RequestParam(value = "eDate", required = false) String endDate,
            @RequestParam(value = "hours", required = false, defaultValue = "0") byte hourCount,
            Pageable pageable
    ) {
        return lessonService.getEntityPage(
                orderBy,
                isAscending,
                departmentId,
                professorId,
                subjectId,
                studentGroupId,
                testingTypeId,
                lessonTypeId,
                startDate,
                endDate,
                hourCount,
                pageable
        );
    }

    @GetMapping("/getById/{id}")
    public Lesson getById(@PathVariable long id) {
        return lessonService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return lessonService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<Lesson> getAll(
            @RequestParam(value = "groupId") long groupId,
            @RequestParam(value = "profId", required = false, defaultValue = "0") long profId
    ) {
        if (profId > 0) {
            return lessonService.getAllByGroupAndProfessor(groupId, profId);
        }
        return lessonService.getAllByGroupId(groupId);
    }

    @GetMapping("/getGroups")
    public List<StudentGroup> getGroupsByProfessor(@RequestParam(value = "profId") long profId) {
        return lessonService.getGroupsByProfessor(profId);
    }

    // CREATE
    @PostMapping()
    public Lesson create(@RequestBody Lesson lesson) {
        return lessonService.create(lesson);
    }

    // UPDATE
    @PutMapping()
    public Lesson update(@RequestBody Lesson lesson) {
        return lessonService.update(lesson);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return lessonService.deleteByIds(idArray);
    }

}
