package com.sabordocampo.pedido.repository;

import com.sabordocampo.pedido.domain.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    boolean existsByCodigo(String codigo);
}
