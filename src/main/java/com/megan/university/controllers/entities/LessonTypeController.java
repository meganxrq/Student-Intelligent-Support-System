package com.megan.university.controllers.entities;

import com.megan.university.entities.LessonType;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.LessonTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/lessonType")
@RequiredArgsConstructor
public class LessonTypeController {

    private final LessonTypeService lessonTypeService;

    @GetMapping()
    public EntityPage<LessonType> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "type", required = false) String type,
            Pageable pageable
    ) {
        return lessonTypeService.getEntityPage(orderBy, isAscending, type, pageable);
    }

    @GetMapping("/getById/{id}")
    public LessonType getById(@PathVariable long id) {
        return lessonTypeService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return lessonTypeService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<LessonType> getAll() {
        return lessonTypeService.getAll();
    }

    // CREATE
    @PostMapping()
    public LessonType create(@RequestBody LessonType lessonType) {
        return lessonTypeService.create(lessonType);
    }

    // UPDATE
    @PutMapping()
    public LessonType update(@RequestBody LessonType lessonType) {
        return lessonTypeService.update(lessonType);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return lessonTypeService.deleteByIds(idArray);
    }

}
