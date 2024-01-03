package com.megan.university.controllers.entities;

import com.megan.university.entities.Subject;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/subject")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping()
    public EntityPage<Subject> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "shortName", required = false) String shortName,
            Pageable pageable
    ) {
        return subjectService.getEntityPage(orderBy, isAscending, fullName, shortName, pageable);
    }

    @GetMapping("/getById/{id}")
    public Subject getById(@PathVariable long id) {
        return subjectService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return subjectService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<Subject> getAll() {
        return subjectService.getAll();
    }

    // CREATE
    @PostMapping()
    public Subject create(@RequestBody Subject subject) {
        return subjectService.create(subject);
    }

    // UPDATE
    @PutMapping()
    public Subject update(@RequestBody Subject subject) {
        return subjectService.update(subject);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return subjectService.deleteByIds(idArray);
    }

}
