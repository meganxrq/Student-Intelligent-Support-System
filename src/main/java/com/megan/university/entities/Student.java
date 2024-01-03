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
@Table(name = "students")
@Getter
@Setter
public class Student implements UserDetails {

    private final static Collection<? extends GrantedAuthority> GRANTED_AUTHORITIES = Collections.singleton(new SimpleGrantedAuthority(String.valueOf(Role.STUDENT)));

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
    @JoinColumn(name = "stud_group_id", nullable = false)
    private StudentGroup studentGroup;

    @ManyToOne
    @JoinColumn(name = "scholarship_id")
    private Scholarship scholarship;

    @ManyToOne
    @JoinColumn(name = "edu_fund_id", nullable = false)
    private EduFund eduFund;

    @JsonIgnore
    @Column(name = "login", unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    private String password;

    public Student(String sex, String firstName, String lastName, StudentGroup studentGroup, Scholarship scholarship, EduFund eduFund) {
        this.sex = sex;
        this.firstName = firstName;
        this.lastName = lastName;
        this.studentGroup = studentGroup;
        this.scholarship = scholarship;
        this.eduFund = eduFund;
    }

    public Student() {
    }

    public void setUserInfo(String login, String password) {
        this.username = login;
        this.password = password;
    }

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return GRANTED_AUTHORITIES;
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
