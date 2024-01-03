package com.megan.university.configs;

import com.megan.university.models.Admin;
import com.megan.university.models.Role;
import com.megan.university.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    UserService userService;

    @Bean
    public AuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);
        provider.setPasswordEncoder(getPasswordEncoder());
        return provider;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.cors().and()
                .authorizeRequests()
                // Only admins
                .antMatchers("/dbfill", "/admin").hasAuthority(String.valueOf(Role.ADMIN))
                // Common
                .antMatchers(HttpMethod.GET, "/*.js", "/*.ico", "/", "/sign-in").permitAll()
                // Only auth users
                .antMatchers("/profile", "/progress").hasAnyAuthority(String.valueOf(Role.STUDENT), String.valueOf(Role.PROFESSOR))
                .antMatchers("/user").hasAnyAuthority(String.valueOf(Role.STUDENT), String.valueOf(Role.PROFESSOR), String.valueOf(Role.ADMIN))
                .antMatchers(HttpMethod.GET, "/db/**").hasAnyAuthority(String.valueOf(Role.STUDENT), String.valueOf(Role.PROFESSOR), String.valueOf(Role.ADMIN))
                .antMatchers(HttpMethod.PUT, "/db/**").hasAnyAuthority(String.valueOf(Role.PROFESSOR), String.valueOf(Role.ADMIN))
                .antMatchers(HttpMethod.POST, "/db/**").hasAnyAuthority(String.valueOf(Role.ADMIN))
                .antMatchers(HttpMethod.DELETE, "/db/**").hasAnyAuthority(String.valueOf(Role.ADMIN))
                .anyRequest().authenticated()
                .and().httpBasic().authenticationEntryPoint(
                (request, response, authException) -> response.sendError(
                        HttpStatus.UNAUTHORIZED.value(),
                        HttpStatus.UNAUTHORIZED.getReasonPhrase())
        );

    }

    @Bean
    public NoOpPasswordEncoder getPasswordEncoder() {
        return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
                .withUser(Admin.USERNAME)
                .password(getPasswordEncoder().encode(Admin.PASSWORD))
                .authorities(String.valueOf(Role.ADMIN));
        auth.userDetailsService(userService).passwordEncoder(getPasswordEncoder());
    }

}
