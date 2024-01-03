package com.megan.university.controllers.entities;

import com.megan.university.entities.ProfessorDegree;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.ProfessorDegreeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/professorDegree")
@RequiredArgsConstructor
public class ProfessorDegreeController {

    private final ProfessorDegreeService professorDegreeService;

    @GetMapping()
    public EntityPage<ProfessorDegree> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "name", required = false) String name,
            Pageable pageable
    ) {
        return professorDegreeService.getEntityPage(orderBy, isAscending, name, pageable);
    }

    @GetMapping("/getById/{id}")
    public ProfessorDegree getById(@PathVariable long id) {
        return professorDegreeService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return professorDegreeService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<ProfessorDegree> getAll() {
        return professorDegreeService.getAll();
    }

    // CREATE
    @PostMapping()
    public ProfessorDegree create(@RequestBody ProfessorDegree professorDegree) {
        return professorDegreeService.create(professorDegree);
    }

    // UPDATE
    @PutMapping()
    public ProfessorDegree update(@RequestBody ProfessorDegree professorDegree) {
        return professorDegreeService.update(professorDegree);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return professorDegreeService.deleteByIds(idArray);
    }

}
