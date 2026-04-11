package com.sabordocampo.cart.web;

import com.sabordocampo.cart.domain.Address;
import com.sabordocampo.cart.domain.ShoppingCart;
import com.sabordocampo.cart.dto.CartItemRequest;
import com.sabordocampo.cart.dto.CartItemResponse;
import com.sabordocampo.cart.dto.ShoppingCartResponse;
import com.sabordocampo.cart.repository.ShoppingCartRepository;
import com.sabordocampo.cart.service.CartService;
import jakarta.validation.Valid;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class CartController {
    private final CartService cartService;
    private final ShoppingCartRepository shoppingCartRepository;

    public CartController(CartService cartService, ShoppingCartRepository shoppingCartRepository) {
        this.cartService = cartService;
        this.shoppingCartRepository = shoppingCartRepository;
    }

    @GetMapping("/carts/{cartId}")
    public ShoppingCartResponse getCart(@PathVariable Long cartId) {
        return cartService.getCart(cartId);
    }

    @GetMapping("/carts/{cartId}/items")
    public List<CartItemResponse> listCartItems(@PathVariable Long cartId) {
        return cartService.listCartItems(cartId);
    }

    @PostMapping("/carts/{cartId}/items")
    public CartItemResponse createCartItem(@PathVariable Long cartId, @Valid @RequestBody CartItemRequest request) {
        return cartService.createCartItem(cartId, request);
    }

    @DeleteMapping("carts/{cartId}/items/{itemId}")
    public void removeCartItem(@PathVariable Long cartId, @PathVariable Long itemId) {
        cartService.removeCartItem(cartId, itemId);
    }

    @PutMapping("/carts/{cartId}/address")
    public void updateAddress(@PathVariable Long cartId, @RequestBody Address address) {
        cartService.updateAddress(cartId, address);
    }
}
