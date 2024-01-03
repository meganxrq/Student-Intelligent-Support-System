package com.megan.university.controllers.entities;

import com.megan.university.entities.Department;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/department")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping()
    public EntityPage<Department> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "facultyId", required = false, defaultValue = "0") long facultyId,
            Pageable pageable
    ) {
        return departmentService.getEntityPage(orderBy, isAscending, name, facultyId, pageable);
    }

    @GetMapping("/getById/{id}")
    public Department getById(@PathVariable long id) {
        return departmentService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return departmentService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<Department> getAll(@RequestParam(value = "fName") String facultyShortName) {
        return departmentService.getAllByFaculty(facultyShortName);
    }

    // CREATE
    @PostMapping()
    public Department create(@RequestBody Department department) {
        return departmentService.create(department);
    }

    // UPDATE
    @PutMapping()
    public Department update(@RequestBody Department department) {
        return departmentService.update(department);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return departmentService.deleteByIds(idArray);
    }

}
