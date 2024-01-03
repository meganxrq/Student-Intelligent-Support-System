package com.megan.university.controllers.entities;

import com.megan.university.entities.TestingType;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.TestingTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/testingType")
@RequiredArgsConstructor
public class TestingTypeController {

    private final TestingTypeService testingTypeService;

    @GetMapping()
    public EntityPage<TestingType> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "type", required = false) String type,
            Pageable pageable
    ) {
        return testingTypeService.getEntityPage(orderBy, isAscending, type, pageable);
    }

    @GetMapping("/getById/{id}")
    public TestingType getById(@PathVariable long id) {
        return testingTypeService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return testingTypeService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<TestingType> getAll() {
        return testingTypeService.getAll();
    }

    // CREATE
    @PostMapping()
    public TestingType create(@RequestBody TestingType testingType) {
        return testingTypeService.create(testingType);
    }

    // UPDATE
    @PutMapping()
    public TestingType update(@RequestBody TestingType testingType) {
        return testingTypeService.update(testingType);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return testingTypeService.deleteByIds(idArray);
    }

}
