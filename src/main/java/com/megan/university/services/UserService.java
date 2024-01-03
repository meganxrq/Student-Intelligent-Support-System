package com.megan.university.services;

import com.megan.university.models.Admin;
import com.megan.university.repositories.entities.ProfessorRepository;
import com.megan.university.repositories.entities.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        if (login.startsWith("s")) {
            return studentRepository.findStudentByUsernameEquals(login).orElse(null);
        } else if (login.startsWith("p")) {
            return professorRepository.findProfessorByUsernameEquals(login).orElse(null);
        }
        return new Admin();
    }
}
