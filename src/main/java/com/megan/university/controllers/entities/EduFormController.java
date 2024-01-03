package com.megan.university.controllers.entities;

import com.megan.university.entities.EduForm;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.EduFormService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/eduForm")
@RequiredArgsConstructor
public class EduFormController {

    private final EduFormService eduFormService;

    @GetMapping()
    public EntityPage<EduForm> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "name", required = false) String name,
            Pageable pageable
    ) {
        return eduFormService.getEntityPage(orderBy, isAscending, name, pageable);
    }

    @GetMapping("/getById/{id}")
    public EduForm getById(@PathVariable long id) {
        return eduFormService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return eduFormService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<EduForm> getAll() {
        return eduFormService.getAll();
    }

    // CREATE
    @PostMapping()
    public EduForm create(@RequestBody EduForm eduForm) {
        return eduFormService.create(eduForm);
    }

    // UPDATE
    @PutMapping()
    public EduForm update(@RequestBody EduForm eduForm) {
        return eduFormService.update(eduForm);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return eduFormService.deleteByIds(idArray);
    }

}
