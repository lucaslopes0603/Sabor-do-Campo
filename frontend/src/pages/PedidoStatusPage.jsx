import { useEffect, useMemo, useState } from 'react';
import { buscarStatusPedido, confirmarEntregaPedido } from '../services/pedidoService';

const STATUS_FLOW = [
  'PEDIDO_FEITO',
  'PEDIDO_EM_PREPARO',
  'PEDIDO_EM_ROTA_DE_ENTREGA',
  'PEDIDO_ENTREGUE',
];

const STATUS_LABEL = {
  PEDIDO_FEITO: 'Pedido feito',
  PEDIDO_EM_PREPARO: 'Pedido em preparo',
  PEDIDO_EM_ROTA_DE_ENTREGA: 'Pedido em rota de entrega',
  PEDIDO_ENTREGUE: 'Pedido entregue',
};

const STATUS_DESCRIPTION = {
  PEDIDO_FEITO: 'Recebemos seu pedido e ja estamos organizando.',
  PEDIDO_EM_PREPARO: 'Sua refeicao esta sendo preparada.',
  PEDIDO_EM_ROTA_DE_ENTREGA: 'Nosso entregador esta a caminho do seu endereco.',
  PEDIDO_ENTREGUE: 'Pedido finalizado com sucesso.',
};

function formatCurrency(value) {
  return Number(value ?? 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function PedidoStatusPage({ pedido, pedidos = [], onBackToMenu, onStatusChange }) {
  const availablePedidos = useMemo(() => (
    pedidos.length > 0 ? pedidos : pedido?.id ? [pedido] : []
  ), [pedido, pedidos]);

  const [selectedPedidoId, setSelectedPedidoId] = useState(availablePedidos[0]?.id ?? null);
  const currentPedido = availablePedidos.find((item) => item.id === selectedPedidoId)
    ?? availablePedidos[0]
    ?? null;
  const [status, setStatus] = useState(currentPedido?.status ?? 'PEDIDO_FEITO');
  const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);

  useEffect(() => {
    if (!availablePedidos.some((item) => item.id === selectedPedidoId)) {
      setSelectedPedidoId(availablePedidos[0]?.id ?? null);
    }
  }, [availablePedidos, selectedPedidoId]);

  useEffect(() => {
    setStatus(currentPedido?.status ?? 'PEDIDO_FEITO');
  }, [currentPedido?.id, currentPedido?.status]);

  useEffect(() => {
    if (!currentPedido?.id) return;

    let intervalId;
    let isMounted = true;

    async function loadStatus() {
      try {
        const response = await buscarStatusPedido(currentPedido.id);
        if (!isMounted) return;
        setStatus(response.status);
      } catch (err) {
        console.error(err);
      }
    }

    loadStatus();
    intervalId = window.setInterval(loadStatus, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [currentPedido?.id]);

  useEffect(() => {
    if (!currentPedido?.id || !onStatusChange) return;
    onStatusChange(currentPedido.id, status);
  }, [currentPedido?.id, status, onStatusChange]);

  const currentStep = useMemo(() => STATUS_FLOW.indexOf(status), [status]);
  const safeStep = currentStep < 0 ? 0 : currentStep;
  const progressPercent = Math.round((safeStep / (STATUS_FLOW.length - 1)) * 100);
  const canConfirmDelivery = status === 'PEDIDO_EM_ROTA_DE_ENTREGA';

  async function handleConfirmDelivery() {
    if (!currentPedido?.id) return;

    try {
      setIsConfirmingDelivery(true);
      const response = await confirmarEntregaPedido(currentPedido.id);
      setStatus(response.status);
    } catch (err) {
      alert(err.message || 'Nao foi possivel confirmar entrega.');
    } finally {
      setIsConfirmingDelivery(false);
    }
  }

  if (!currentPedido?.id) {
    return (
      <section className="hero-card">
        <div className="hero-copy">
          <h2>Nenhum pedido ativo</h2>
          <button className="edit-address-button" onClick={onBackToMenu}>
            Voltar ao cardápio
          </button>
        </div>
      </section>
    );
  }

  return (
      <section className="hero-card">
        <div className="hero-copy">
          <h2>Status dos pedidos</h2>
          <p className="pedido-code">Codigo: {currentPedido.codigo}</p>
        </div>

        <div className="menu-panel">
          {availablePedidos.length > 1 ? (
            <div className="pedido-switcher" aria-label="Pedidos em andamento">
              {availablePedidos.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === currentPedido.id ? 'active' : ''}
                  onClick={() => setSelectedPedidoId(item.id)}
                >
                  <strong>{item.codigo}</strong>
                  <span>{STATUS_LABEL[item.status] ?? item.status}</span>
                </button>
              ))}
            </div>
          ) : null}

          <div className="status-summary">
            <p className="status-summary-label">Etapa atual</p>
            <div className="status-summary-main">
              <strong>{STATUS_LABEL[status]}</strong>
              <span className="order-status-chip">{progressPercent}%</span>
            </div>
            <p className="status-summary-description">{STATUS_DESCRIPTION[status]}</p>
          </div>

          <div className="status-progress-track" aria-hidden="true">
            <div className="status-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="pedido-products">
            <div className="pedido-products-heading">
              <h3>Produtos do pedido</h3>
              <strong>{formatCurrency(currentPedido.precoTotal)}</strong>
            </div>

            <div className="pedido-products-list">
              {(currentPedido.itens ?? []).map((item) => (
                <div className="pedido-product-row" key={item.id}>
                  <div className="pedido-product-image-wrap">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.nome} />
                    ) : (
                      <span>Foto</span>
                    )}
                  </div>
                  <div>
                    <strong>{item.nome}</strong>
                    <p>{formatCurrency(item.preco)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="status-list">
            {STATUS_FLOW.map((step, index) => {
              const stateClass =
                index < safeStep ? 'status-done' : index === safeStep ? 'status-current' : 'status-pending';

              return (
                <div key={step} className={`status-row ${stateClass}`}>
                  <div className="status-row-head">
                    <strong>{STATUS_LABEL[step]}</strong>
                    <span>{index < safeStep ? 'Concluido' : index === safeStep ? 'Atual' : 'Pendente'}</span>
                  </div>
                  <p>{STATUS_DESCRIPTION[step]}</p>
                </div>
              );
            })}
          </div>

          <div className="status-actions">
            {canConfirmDelivery ? (
              <button
                className="edit-address-button"
                onClick={handleConfirmDelivery}
                disabled={isConfirmingDelivery}
              >
                {isConfirmingDelivery ? 'Confirmando...' : 'Confirmar entrega'}
              </button>
            ) : null}

            <button className="edit-address-button" onClick={onBackToMenu}>
              Voltar ao cardápio
            </button>
          </div>
        </div>
      </section>
  );
}

export default PedidoStatusPage;
