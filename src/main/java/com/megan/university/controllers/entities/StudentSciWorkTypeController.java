package com.megan.university.controllers.entities;

import com.megan.university.entities.StudentSciWorkType;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.StudentSciWorkTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/studentSciWorkType")
@RequiredArgsConstructor
public class StudentSciWorkTypeController {

    private final StudentSciWorkTypeService studentSciWorkTypeService;

    @GetMapping()
    public EntityPage<StudentSciWorkType> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAscending") boolean isAscending,
            @RequestParam(value = "type", required = false) String type,
            Pageable pageable
    ) {
        return studentSciWorkTypeService.getEntityPage(orderBy, isAscending, type, pageable);
    }

    @GetMapping("/getById/{id}")
    public StudentSciWorkType getById(@PathVariable long id) {
        return studentSciWorkTypeService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return studentSciWorkTypeService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<StudentSciWorkType> getAll() {
        return studentSciWorkTypeService.getAll();
    }

    // CREATE
    @PostMapping()
    public StudentSciWorkType create(@RequestBody StudentSciWorkType studentSciWorkType) {
        return studentSciWorkTypeService.create(studentSciWorkType);
    }

    // UPDATE
    @PutMapping()
    public StudentSciWorkType update(@RequestBody StudentSciWorkType studentSciWorkType) {
        return studentSciWorkTypeService.update(studentSciWorkType);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return studentSciWorkTypeService.deleteByIds(idArray);
    }

}
