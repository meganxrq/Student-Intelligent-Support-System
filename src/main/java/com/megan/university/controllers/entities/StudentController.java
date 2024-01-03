package com.megan.university.controllers.entities;

import com.megan.university.entities.Student;
import com.megan.university.models.EntityPage;
import com.megan.university.services.entities.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/db/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping()
    public EntityPage<Student> getEntityPage(
            @RequestParam(value = "orderBy") String orderBy,
            @RequestParam(value = "isAsc") boolean isAscending,
            @RequestParam(value = "sex", required = false) String sex,
            @RequestParam(value = "fName", required = false) String firstName,
            @RequestParam(value = "lName", required = false) String lastName,
            @RequestParam(value = "program", required = false) String program,
            @RequestParam(value = "year", required = false, defaultValue = "0") short startYear,
            @RequestParam(value = "facultyId", required = false, defaultValue = "0") long facultyId,
            @RequestParam(value = "number", required = false, defaultValue = "0") int groupNumber,
            @RequestParam(value = "eduFundId", required = false, defaultValue = "0") long eduFundId,
            @RequestParam(value = "scholarshipId", required = false, defaultValue = "0") long scholarshipId,
            Pageable pageable
    ) {
        return studentService.getEntityPage(
                orderBy,
                isAscending,
                sex,
                firstName,
                lastName,
                program,
                startYear,
                facultyId,
                groupNumber,
                eduFundId,
                scholarshipId,
                pageable
        );
    }

    @GetMapping("/getById/{id}")
    public Student getById(@PathVariable long id) {
        return studentService.getById(id);
    }

    @GetMapping("/getTotalCount")
    public long getTotalCount() {
        return studentService.getTotalCount();
    }

    @GetMapping("/getAll")
    public List<Student> getAllByGroupId(@RequestParam(value = "groupId", required = false, defaultValue = "0") long groupId) {
        if (groupId > 0)
            return studentService.getAllByGroupId(groupId);
        return studentService.getAll();
    }

    @GetMapping("/getCredentials")
    public String[] getCredentials(@RequestParam(value = "studId") long studentId, Authentication auth) {
        return studentService.getCredentials(studentId, auth);
    }

    // CREATE
    @PostMapping()
    public Student create(@RequestBody Student student) {
        return studentService.create(student);
    }

    // UPDATE
    @PutMapping()
    public Student update(@RequestBody Student student) {
        return studentService.update(student);
    }

    // DELETE
    @DeleteMapping("/{idArray}")
    public long deleteByIds(@PathVariable long[] idArray) {
        return studentService.deleteByIds(idArray);
    }

}
