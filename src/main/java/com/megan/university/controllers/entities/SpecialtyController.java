package com.megan.university.controllers.entities;

import com.megan.university.entities.Specialty;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.SpecialtyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/specialty")
@RequiredArgsConstructor
public class SpecialtyController {

    private final SpecialtyService specialtyService;

    @GetMapping()
    public EntityPage<Specialty> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "facultyId", required = false, defaultValue = "0") long facultyId,
            @RequestParam(value = "program", required = false) String program,
            @RequestParam(value = "duration", required = false, defaultValue = "0") byte duration,
            Pageable pageable
    ) {
        return specialtyService.getEntityPage(orderBy, isAscending, code, name, facultyId, program, duration, pageable);
    }

    @GetMapping("/getByCode/{code}")
    public Specialty getByCode(@PathVariable String code) {
        return specialtyService.getByCode(code);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return specialtyService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<Specialty> getAll(@RequestParam(value = "fShortName", required = false) String shortName) {
        if (shortName == null) {
            return specialtyService.getAll();
        }
        return specialtyService.getAllByFaculty(shortName);
    }

    // CREATE
    @PostMapping()
    public Specialty create(@RequestBody Specialty specialty) {
        return specialtyService.create(specialty);
    }

    // UPDATE
    @PutMapping()
    public Specialty update(@RequestBody Specialty specialty) {
        return specialtyService.update(specialty);
    }

    // DELETE
    @DeleteMapping("/{codeArray}")
    public long deleteByCodes(@PathVariable String[] codeArray) {
        return specialtyService.deleteByCodes(codeArray);
    }

}
