package com.megan.university.controllers.entities;

import com.megan.university.entities.ProfessorSciWork;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.ProfessorSciWorkService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/professorSciWork")
@RequiredArgsConstructor
public class ProfessorSciWorkController {

    private final ProfessorSciWorkService professorSciWorkService;

    @GetMapping()
    public EntityPage<ProfessorSciWork> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "facultyId", required = false, defaultValue = "0") long facultyId,
            @RequestParam(value = "deptId", required = false, defaultValue = "0") long departmentId,
            @RequestParam(value = "profId", required = false, defaultValue = "0") long professorId,
            @RequestParam(value = "workTypeId", required = false, defaultValue = "0") long professorSciWorkTypeId,
            @RequestParam(value = "topic", required = false) String topic,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "date", required = false) String date,
            Pageable pageable
    ) {
        return professorSciWorkService.getEntityPage(
                orderBy,
                isAscending,
                facultyId,
                departmentId,
                professorId,
                professorSciWorkTypeId,
                topic,
                status,
                date,
                pageable
        );
    }

    @GetMapping("/getById/{id}")
    public ProfessorSciWork getById(@PathVariable long id) {
        return professorSciWorkService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return professorSciWorkService.getTotalCount();
    }

    // CREATE
    @PostMapping()
    public ProfessorSciWork create(@RequestBody ProfessorSciWork professorSciWork) {
        return professorSciWorkService.create(professorSciWork);
    }

    // UPDATE
    @PutMapping()
    public ProfessorSciWork update(@RequestBody ProfessorSciWork professorSciWork) {
        return professorSciWorkService.update(professorSciWork);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return professorSciWorkService.deleteByIds(idArray);
    }

}
