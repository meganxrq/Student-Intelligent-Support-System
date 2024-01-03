package com.megan.university.controllers.entities;

import com.megan.university.entities.StudentGroup;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.StudentGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/studentGroup")
@RequiredArgsConstructor
public class StudentGroupController {

    private final StudentGroupService studentGroupService;

    @GetMapping()
    public EntityPage<StudentGroup> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "year", required = false, defaultValue = "0") short startYear,
            @RequestParam(value = "number", required = false, defaultValue = "0") int number,
            @RequestParam(value = "fieldId", required = false, defaultValue = "0") long fieldId,
            @RequestParam(value = "program", required = false) String program,
            @RequestParam(value = "eduFormId", required = false, defaultValue = "0") long eduFormId,
            Pageable pageable
    ) {
        return studentGroupService.getEntityPage(orderBy, isAscending, startYear, number, fieldId, program, eduFormId, pageable);
    }

    @GetMapping("/getById/{id}")
    public StudentGroup getById(@PathVariable long id) {
        return studentGroupService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return studentGroupService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<StudentGroup> getAll() {
        return studentGroupService.getAll();
    }

    // CREATE
    @PostMapping()
    public StudentGroup create(@RequestBody StudentGroup studentGroup) {
        return studentGroupService.create(studentGroup);
    }

    // UPDATE
    @PutMapping()
    public StudentGroup update(@RequestBody StudentGroup studentGroup) {
        return studentGroupService.update(studentGroup);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return studentGroupService.deleteByIds(idArray);
    }

}
