package com.megan.university.controllers.entities;

import com.megan.university.entities.Professor;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.ProfessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/professor")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    @GetMapping()
    public EntityPage<Professor> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "sex", required = false) String sex,
            @RequestParam(value = "fName", required = false) String firstName,
            @RequestParam(value = "lName", required = false) String lastName,
            @RequestParam(value = "deptId", required = false, defaultValue = "0") long departmentId,
            @RequestParam(value = "degreeId", required = false, defaultValue = "0") long degreeId,
            Pageable pageable
    ) {
        return professorService.getEntityPage(orderBy, isAscending, sex, firstName, lastName, departmentId, degreeId, pageable);
    }

    @GetMapping("/getById/{id}")
    public Professor getById(@PathVariable long id) {
        return professorService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return professorService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<Professor> getAllByDeptName(@RequestParam(value = "deptName") String departmentName) {
        return professorService.getAllByDeptName(departmentName);
    }

    @GetMapping("/getCredentials")
    public String[] getCredentials(@RequestParam(value = "profId") long professorId, Authentication auth) {
        return professorService.getCredentials(professorId, auth);
    }

    // CREATE
    @PostMapping()
    public Professor create(@RequestBody Professor professor) {
        return professorService.create(professor);
    }

    // UPDATE
    @PutMapping()
    public Professor update(@RequestBody Professor professor) {
        return professorService.update(professor);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return professorService.deleteByIds(idArray);
    }

}
