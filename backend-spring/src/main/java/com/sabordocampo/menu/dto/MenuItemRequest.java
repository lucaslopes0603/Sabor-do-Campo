package com.sabordocampo.menu.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record MenuItemRequest(
    @NotBlank(message = "Nome e obrigatorio.") String name,
    @NotBlank(message = "Descricao e obrigatoria.") String description,
    @NotNull(message = "Preco e obrigatorio.") @DecimalMin(value = "0.0", inclusive = true, message = "Preco nao pode ser negativo.") BigDecimal price,
    @NotBlank(message = "Categoria e obrigatoria.") String category,
    String ingredients,
    String imageUrl
) {
}
