package com.megan.university.controllers.entities;

import com.megan.university.entities.StudentGroup;
import com.megan.university.entities.Traineeship;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.TraineeshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/traineeship")
@RequiredArgsConstructor
public class TraineeshipController {

    private final TraineeshipService traineeshipService;

    @GetMapping()
    public EntityPage<Traineeship> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "facultyId", required = false, defaultValue = "0") long facultyId,
            @RequestParam(value = "deptId", required = false, defaultValue = "0") long departmentId,
            @RequestParam(value = "profId", required = false, defaultValue = "0") long professorId,
            @RequestParam(value = "groupId", required = false, defaultValue = "0") long studentGroupId,
            @RequestParam(value = "tTypeId", required = false, defaultValue = "0") long traineeshipTypeId,
            @RequestParam(value = "sDate", required = false) String startDate,
            @RequestParam(value = "eDate", required = false) String endDate,
            Pageable pageable
    ) {
        return traineeshipService.getEntityPage(
                orderBy,
                isAscending,
                facultyId,
                departmentId,
                professorId,
                studentGroupId,
                traineeshipTypeId,
                startDate,
                endDate,
                pageable
        );
    }

    @GetMapping("/getById/{id}")
    public Traineeship getById(@PathVariable long id) {
        return traineeshipService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return traineeshipService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<Traineeship> getAll(
            @RequestParam(value = "groupId") long groupId,
            @RequestParam(value = "profId", required = false, defaultValue = "0") long profId
    ) {
        if (profId > 0) {
            return traineeshipService.getAllByGroupAndProfessor(groupId, profId);
        }
        return traineeshipService.getAllByGroupId(groupId);
    }

    @GetMapping("/getGroups")
    public List<StudentGroup> getGroupsByProfessor(@RequestParam(value = "profId") long profId) {
        return traineeshipService.getGroupsByProfessor(profId);
    }

    // CREATE
    @PostMapping()
    public Traineeship create(@RequestBody Traineeship traineeship) {
        return traineeshipService.create(traineeship);
    }

    // UPDATE
    @PutMapping()
    public Traineeship update(@RequestBody Traineeship traineeship) {
        return traineeshipService.update(traineeship);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return traineeshipService.deleteByIds(idArray);
    }

}
