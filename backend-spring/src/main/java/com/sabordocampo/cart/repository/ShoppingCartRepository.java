package com.sabordocampo.cart.repository;

import com.sabordocampo.cart.domain.ShoppingCart;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
}
