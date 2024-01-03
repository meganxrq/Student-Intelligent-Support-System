package com.megan.university.controllers.entities;

import com.megan.university.entities.TraineeshipType;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.TraineeshipTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/traineeshipType")
@RequiredArgsConstructor
public class TraineeshipTypeController {

    private final TraineeshipTypeService traineeshipTypeService;

    @GetMapping()
    public EntityPage<TraineeshipType> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "type", required = false) String type,
            Pageable pageable
    ) {
        return traineeshipTypeService.getEntityPage(orderBy, isAscending, type, pageable);
    }

    @GetMapping("/getById/{id}")
    public TraineeshipType getById(@PathVariable long id) {
        return traineeshipTypeService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return traineeshipTypeService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<TraineeshipType> getAll() {
        return traineeshipTypeService.getAll();
    }

    // CREATE
    @PostMapping()
    public TraineeshipType create(@RequestBody TraineeshipType traineeshipType) {
        return traineeshipTypeService.create(traineeshipType);
    }

    // UPDATE
    @PutMapping()
    public TraineeshipType update(@RequestBody TraineeshipType traineeshipType) {
        return traineeshipTypeService.update(traineeshipType);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return traineeshipTypeService.deleteByIds(idArray);
    }

}
