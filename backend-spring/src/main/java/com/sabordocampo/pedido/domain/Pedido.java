package com.sabordocampo.pedido.domain;

import com.sabordocampo.cart.domain.Address;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 32)
    private String codigo;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @Embedded
    private Address enderecoEntrega;

    @Column
    private LocalDateTime entregueEm;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> itens = new ArrayList<>();

    protected Pedido() {
    }

    public Pedido(String codigo, LocalDateTime criadoEm, Address enderecoEntrega) {
        this.codigo = codigo;
        this.criadoEm = criadoEm;
        this.enderecoEntrega = enderecoEntrega;
    }

    public Long getId() {
        return id;
    }

    public String getCodigo() {
        return codigo;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public Address getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public LocalDateTime getEntregueEm() {
        return entregueEm;
    }

    public List<PedidoItem> getItens() {
        return itens;
    }

    public void adicionarItem(PedidoItem item) {
        itens.add(item);
    }

    public void confirmarEntrega(LocalDateTime entregueEm) {
        this.entregueEm = entregueEm;
    }

    public BigDecimal getPrecoTotal() {
        return itens.stream()
            .map(PedidoItem::getPrice)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
