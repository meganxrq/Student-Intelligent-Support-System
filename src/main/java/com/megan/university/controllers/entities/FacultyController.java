package com.megan.university.controllers.entities;

import com.megan.university.entities.Faculty;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping()
    public EntityPage<Faculty> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "shortName", required = false) String shortName,
            Pageable pageable
    ) {
        return facultyService.getEntityPage(orderBy, isAscending, fullName, shortName, pageable);
    }

    @GetMapping("/getAll")
    public List<Faculty> getAll() {
        return facultyService.getAll();
    }

    @GetMapping("/getById/{id}")
    public Faculty getById(@PathVariable long id) {
        return facultyService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return facultyService.getTotalCount();
    }

    @GetMapping("/getFirst")
    public Faculty getFirst() {
        return facultyService.getFirst();
    }

    // CREATE
    @PostMapping()
    public Faculty create(@RequestBody Faculty faculty) {
        return facultyService.create(faculty);
    }

    // UPDATE
    @PutMapping()
    public Faculty update(@RequestBody Faculty faculty) {
        return facultyService.update(faculty);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return facultyService.deleteByIds(idArray);
    }

}
