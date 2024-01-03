package com.megan.university.controllers.entities;

import com.megan.university.entities.TraineeshipProgress;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.TraineeshipProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/traineeshipProgress")
@RequiredArgsConstructor
public class TraineeshipProgressController {

    private final TraineeshipProgressService traineeshipProgressService;

    @GetMapping()
    public EntityPage<TraineeshipProgress> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "groupId", required = false, defaultValue = "0") long studentGroupId,
            @RequestParam(value = "studId", required = false, defaultValue = "0") long studentId,
            @RequestParam(value = "profId", required = false, defaultValue = "0") long professorId,
            @RequestParam(value = "traineeshipId", required = false, defaultValue = "0") long traineeshipId,
            @RequestParam(value = "pass", required = false) String passStatus,
            Pageable pageable
    ) {
        return traineeshipProgressService.getEntityPage(orderBy, isAscending, studentGroupId, studentId, professorId, traineeshipId, passStatus, pageable);
    }

    @GetMapping("/getById/{id}")
    public TraineeshipProgress getById(@PathVariable long id) {
        return traineeshipProgressService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return traineeshipProgressService.getTotalCount();
    }

    // CREATE
    @PostMapping()
    public TraineeshipProgress create(@RequestBody TraineeshipProgress studentProgress) {
        return traineeshipProgressService.create(studentProgress);
    }

    // UPDATE
    @PutMapping()
    public TraineeshipProgress update(@RequestBody TraineeshipProgress studentProgress) {
        return traineeshipProgressService.update(studentProgress);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return traineeshipProgressService.deleteByIds(idArray);
    }

}

