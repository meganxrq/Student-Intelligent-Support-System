package com.megan.university.controllers.entities;

import com.megan.university.entities.SpecialtyField;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.SpecialtyFieldService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/specialtyField")
@RequiredArgsConstructor
public class SpecialtyFieldController {

    private final SpecialtyFieldService specialtyFieldService;

    @GetMapping()
    public EntityPage<SpecialtyField> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "sCode", required = false) String sCode,
            Pageable pageable
    ) {
        return specialtyFieldService.getEntityPage(orderBy, isAscending, name, sCode, pageable);
    }

    @GetMapping("/getById/{id}")
    public SpecialtyField getById(@PathVariable long id) {
        return specialtyFieldService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return specialtyFieldService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<SpecialtyField> getAllByFaculty(@RequestParam(value = "sCode") String specialtyCode) {
        return specialtyFieldService.getAllBySpecialty(specialtyCode);
    }

    // CREATE
    @PostMapping()
    public SpecialtyField create(@RequestBody SpecialtyField specialtyField) {
        return specialtyFieldService.create(specialtyField);
    }

    // UPDATE
    @PutMapping()
    public SpecialtyField update(@RequestBody SpecialtyField specialtyField) {
        return specialtyFieldService.update(specialtyField);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return specialtyFieldService.deleteByIds(idArray);
    }

}
