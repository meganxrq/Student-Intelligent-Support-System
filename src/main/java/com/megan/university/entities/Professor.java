package com.megan.university.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.megan.university.models.Role;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "professors")
@Getter
@Setter
public class Professor implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sex", nullable = false)
    private String sex;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne
    @JoinColumn(name = "professor_degree_id", nullable = false)
    private ProfessorDegree degree;

    @JsonIgnore
    @Column(name = "login", unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    public Professor(String sex, String firstName, String lastName, Department department, ProfessorDegree degree) {
        this.sex = sex;
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.degree = degree;
    }

    public Professor() {
    }

    public void setUserInfo(String login, String password) {
        this.username = login;
        this.password = password;
    }

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(String.valueOf(Role.PROFESSOR)));
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return true;
    }

}
