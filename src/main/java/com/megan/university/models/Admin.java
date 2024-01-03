package com.megan.university.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.megan.university.UniversityApplication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class Admin implements UserDetails {

    public static final String USERNAME = "Admin";
    public static final String PASSWORD = "Admin";

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(Role.ADMIN + ""));
    }

    @Override
    public String getUsername() {
        return USERNAME;
    }

    @Override
    public String getPassword() {
        return "";
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
