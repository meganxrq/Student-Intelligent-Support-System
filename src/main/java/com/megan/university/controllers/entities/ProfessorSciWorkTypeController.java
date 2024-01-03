package com.megan.university.controllers.entities;

import com.megan.university.entities.ProfessorSciWorkType;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.ProfessorSciWorkTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/professorSciWorkType")
@RequiredArgsConstructor
public class ProfessorSciWorkTypeController {

    private final ProfessorSciWorkTypeService professorSciWorkTypeService;

    @GetMapping()
    public EntityPage<ProfessorSciWorkType> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAscending") boolean isAscending,
            @RequestParam(value = "type", required = false) String type,
            Pageable pageable
    ) {
        return professorSciWorkTypeService.getEntityPage(orderBy, isAscending, type, pageable);
    }

    @GetMapping("/getById/{id}")
    public ProfessorSciWorkType getById(@PathVariable long id) {
        return professorSciWorkTypeService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return professorSciWorkTypeService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<ProfessorSciWorkType> getAll() {
        return professorSciWorkTypeService.getAll();
    }

    // CREATE
    @PostMapping()
    public ProfessorSciWorkType create(@RequestBody ProfessorSciWorkType professorSciWorkType) {
        return professorSciWorkTypeService.create(professorSciWorkType);
    }

    // UPDATE
    @PutMapping()
    public ProfessorSciWorkType update(@RequestBody ProfessorSciWorkType professorSciWorkType) {
        return professorSciWorkTypeService.update(professorSciWorkType);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return professorSciWorkTypeService.deleteByIds(idArray);
    }

}
