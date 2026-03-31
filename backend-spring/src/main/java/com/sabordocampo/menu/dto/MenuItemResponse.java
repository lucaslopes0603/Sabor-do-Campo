package com.sabordocampo.menu.dto;

import java.math.BigDecimal;
import java.util.List;

public record MenuItemResponse(
    Long id,
    String name,
    String description,
    BigDecimal price,
    String category,
    String categoryLabel,
    List<String> ingredients,
    String imageUrl
) {
}
