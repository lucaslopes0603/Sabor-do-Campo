package com.sabordocampo.menu.domain;

public enum Category {
    ENTRADA("Entradas"),
    PRATO_PRINCIPAL("Prato Principal"),
    SOBREMESA("Sobremesas"),
    BEBIDA("Bebidas");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Category fromValue(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Categoria obrigatoria.");
        }

        String normalized = value.trim().replace('-', '_').replace(' ', '_').toUpperCase();
        return Category.valueOf(normalized);
    }
}
