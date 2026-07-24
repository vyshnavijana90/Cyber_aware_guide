package com.cyberaware;

import com.cyberaware.entity.Admin;
import com.cyberaware.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CyberAwareApplication {
    public static void main(String[] args) {
        SpringApplication.run(CyberAwareApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedAdmin(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!adminRepository.existsByUsername("admin")) {
                Admin admin = Admin.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .role("ADMIN")
                        .build();
                adminRepository.save(admin);
                System.out.println("Default admin user seeded: admin / admin123");
            }
        };
    }
}

