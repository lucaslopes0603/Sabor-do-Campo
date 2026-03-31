package com.sabordocampo.menu.config;

import com.sabordocampo.menu.service.MenuService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedMenu(MenuService menuService) {
        return args -> menuService.seedData();
    }
}
