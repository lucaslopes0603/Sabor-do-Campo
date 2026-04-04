package com.sabordocampo.cart.service;

import com.sabordocampo.cart.domain.CartItem;
import com.sabordocampo.cart.domain.ShoppingCart;
import com.sabordocampo.menu.domain.MenuItem;
import com.sabordocampo.menu.repository.MenuItemRepository;
import com.sabordocampo.cart.dto.CartItemRequest;
import com.sabordocampo.cart.dto.CartItemResponse;
import com.sabordocampo.cart.repository.CartItemRepository;
import com.sabordocampo.cart.repository.ShoppingCartRepository;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;
    private final MenuItemRepository menuItemRepository;
    private final ShoppingCartRepository shoppingCartRepository;

    public CartService(CartItemRepository cartItemRepository, MenuItemRepository menuItemRepository, ShoppingCartRepository shoppingCartRepository) {
        this.cartItemRepository = cartItemRepository;
        this.menuItemRepository = menuItemRepository;
        this.shoppingCartRepository = shoppingCartRepository;
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> listCartItems(Long cartId) {  
        List<CartItem> items = cartItemRepository.findByShoppingCartId(cartId);

        return items.stream().map(this::toResponse).toList();
    }

    @Transactional
    public CartItemResponse createCartItem(Long cartId, CartItemRequest request) {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(cartId)
            .orElseThrow(() -> new RuntimeException("Carrinho não encontrado"));
        MenuItem menuItem = menuItemRepository.findById(request.menuItemId())
            .orElseThrow(() -> new RuntimeException("Item original do menu não encontrado"));
        CartItem cartItem = new CartItem(
            shoppingCart,
            menuItem
        );

        return toResponse(cartItemRepository.save(cartItem));
    }

    @Transactional
    public void removeCartItem(Long cartId, Long itemId) {
        CartItem cartItem = cartItemRepository.findById(itemId)
        .orElseThrow(() -> new RuntimeException("Item do carrinho não encontrado"));
        if (!cartItem.getShoppingCart().getId().equals(cartId)) {
            throw new RuntimeException("Item não pertence ao carrinho");
        }
        cartItemRepository.delete(cartItem);
    }

    private CartItemResponse toResponse(CartItem cartItem) {

        return new CartItemResponse(
            cartItem.getId(),
            cartItem.getMenuItem().getId(),
            cartItem.getMenuItem().getName(),
            cartItem.getMenuItem().getPrice(),
            normalizeOptional(cartItem.getMenuItem().getImageUrl())
        );
    }

    private String normalizeOptional(String value) {
        return value == null ? "" : value.trim();
    }
}
