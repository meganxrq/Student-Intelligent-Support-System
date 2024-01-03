package com.megan.university.services.tools;

// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Random;

public class UserInfoGenerator {

    // private static BCryptPasswordEncoder encrypt = new BCryptPasswordEncoder();

    public static String getPassword() {
        // Generates 8-number password
        Random rnd = new Random();
        String password = "";
        for (int i = 0; i < 9; i++) {
            password += rnd.nextInt(10);
        }
        // return encrypt.encode(password);
        return password;
    }

    public static String getLogin(String prefix) {
        return prefix + Math.abs(LocalDateTime.now().hashCode());
    }

}
