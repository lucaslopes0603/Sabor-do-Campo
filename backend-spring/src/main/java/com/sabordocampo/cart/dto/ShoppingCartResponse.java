package com.sabordocampo.cart.dto;

import java.util.List;

import com.sabordocampo.cart.domain.Address;

public record ShoppingCartResponse(
    Long id,
    List<CartItemResponse> items,
    AddressResponse address
) {
}
