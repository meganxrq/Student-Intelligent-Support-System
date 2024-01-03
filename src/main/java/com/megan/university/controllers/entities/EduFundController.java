package com.megan.university.controllers.entities;

import com.megan.university.entities.EduFund;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.EduFundService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/eduFund")
@RequiredArgsConstructor
public class EduFundController {

    private final EduFundService eduFundService;

    @GetMapping()
    public EntityPage<EduFund> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "name", required = false) String name,
            Pageable pageable
    ) {
        return eduFundService.getEntityPage(orderBy, isAscending, name, pageable);
    }

    @GetMapping("/getById/{id}")
    public EduFund getById(@PathVariable long id) {
        return eduFundService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return eduFundService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<EduFund> getAll() {
        return eduFundService.getAll();
    }

    // CREATE
    @PostMapping()
    public EduFund create(@RequestBody EduFund eduFund) {
        return eduFundService.create(eduFund);
    }

    // UPDATE
    @PutMapping()
    public EduFund update(@RequestBody EduFund eduFund) {
        return eduFundService.update(eduFund);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return eduFundService.deleteByIds(idArray);
    }

}
