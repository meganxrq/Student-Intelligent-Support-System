package com.megan.university;

import com.megan.university.services.tools.OrderValue;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UniversityApplication {

    public static void main(String[] args) {
        OrderValue.defineOrderByParams();
        SpringApplication.run(UniversityApplication.class, args);
    }

}
