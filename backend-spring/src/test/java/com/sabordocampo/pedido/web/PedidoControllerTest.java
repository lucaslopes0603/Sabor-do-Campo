package com.sabordocampo.pedido.web;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sabordocampo.cart.dto.AddressResponse;
import com.sabordocampo.pedido.domain.PedidoStatus;
import com.sabordocampo.pedido.dto.PedidoItemResponse;
import com.sabordocampo.pedido.dto.PedidoResponse;
import com.sabordocampo.pedido.dto.PedidoStatusResponse;
import com.sabordocampo.pedido.service.PedidoService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PedidoController.class)
class PedidoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PedidoService pedidoService;

    @Test
    void confirmarPedidoDeveRetornarPedidoCriado() throws Exception {
        PedidoResponse response = new PedidoResponse(
            1L,
            "PED-ABC12345",
            LocalDateTime.now(),
            PedidoStatus.PEDIDO_FEITO,
            List.of(new PedidoItemResponse(1L, 10L, "Prato Executivo", new BigDecimal("25.00"), "img")),
            new AddressResponse("Rua A", "10", "Centro", "Cidade", "SP", "12345-678", "Apto 1"),
            new BigDecimal("25.00")
        );

        when(pedidoService.criarAPartirDoCarrinho(99L)).thenReturn(response);

        mockMvc.perform(post("/api/carts/99/confirmar-pedido"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.codigo").value("PED-ABC12345"))
            .andExpect(jsonPath("$.status").value("PEDIDO_FEITO"))
            .andExpect(jsonPath("$.itens[0].nome").value("Prato Executivo"))
            .andExpect(jsonPath("$.precoTotal").value(25.00));
    }

    @Test
    void buscarStatusDeveRetornarStatusAtual() throws Exception {
        when(pedidoService.buscarStatus(10L)).thenReturn(new PedidoStatusResponse(10L, "PED-XYZ98765", PedidoStatus.PEDIDO_EM_PREPARO));

        mockMvc.perform(get("/api/pedidos/10/status"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.pedidoId").value(10))
            .andExpect(jsonPath("$.codigo").value("PED-XYZ98765"))
            .andExpect(jsonPath("$.status").value("PEDIDO_EM_PREPARO"));
    }

    @Test
    void confirmarEntregaDeveRetornarStatusEntregue() throws Exception {
        when(pedidoService.confirmarEntrega(77L)).thenReturn(new PedidoStatusResponse(77L, "PED-ENTREGUE", PedidoStatus.PEDIDO_ENTREGUE));

        mockMvc.perform(post("/api/pedidos/77/confirmar-entrega"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PEDIDO_ENTREGUE"));
    }

    @Test
    void deveRetornarBadRequestQuandoServicoLancarIllegalArgument() throws Exception {
        when(pedidoService.buscarStatus(anyLong())).thenThrow(new IllegalArgumentException("Pedido nao encontrado."));

        mockMvc.perform(get("/api/pedidos/123/status"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Pedido nao encontrado."));
    }
}
