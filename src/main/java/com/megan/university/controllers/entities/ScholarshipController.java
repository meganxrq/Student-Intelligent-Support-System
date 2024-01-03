package com.megan.university.controllers.entities;

import com.megan.university.entities.Scholarship;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.ScholarshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/scholarship")
@RequiredArgsConstructor
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    @GetMapping()
    public EntityPage<Scholarship> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "amount", required = false) String amount,
            Pageable pageable
    ) {
        return scholarshipService.getEntityPage(orderBy, isAscending, type, amount, pageable);
    }

    @GetMapping("/getById/{id}")
    public Scholarship getById(@PathVariable long id) {
        return scholarshipService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return scholarshipService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<Scholarship> getAll() {
        return scholarshipService.getAll();
    }

    // CREATE
    @PostMapping()
    public Scholarship create(@RequestBody Scholarship scholarship) {
        return scholarshipService.create(scholarship);
    }

    // UPDATE
    @PutMapping()
    public Scholarship update(@RequestBody Scholarship scholarship) {
        return scholarshipService.update(scholarship);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return scholarshipService.deleteByIds(idArray);
    }

}
