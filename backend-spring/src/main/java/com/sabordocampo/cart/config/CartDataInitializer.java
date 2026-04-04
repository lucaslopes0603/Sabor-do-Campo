package com.sabordocampo.cart.config;

import com.sabordocampo.cart.domain.ShoppingCart;
import com.sabordocampo.cart.repository.ShoppingCartRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Optional;

@Configuration
public class CartDataInitializer {

    @Bean
    CommandLineRunner seedCart(ShoppingCartRepository shoppingCartRepository) {
        return args -> {
            Optional<ShoppingCart> existingCart = shoppingCartRepository.findById(1L);
            if (existingCart.isEmpty()) {
                ShoppingCart cart = new ShoppingCart();
                shoppingCartRepository.save(cart);
            };
        };
    }
}