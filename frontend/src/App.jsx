import { useEffect, useState } from 'react';
import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import ProductFormPage from './pages/ProductFormPage';
import { useMenu } from './hooks/useMenu';
import { fetchCart, createCartItem, removeCartItem } from './services/cartService';
import { confirmarPedido } from './services/pedidoService';
import ShoppingCartPage from './pages/ShoppingCartPage';
import PedidoStatusPage from './pages/PedidoStatusPage';

const CART_ID = 1; // Temporario, enquanto nao tem carrinho por usuario.
const PEDIDO_STORAGE_KEY = 'pedido_atual';

const pages = {
  menu: 'Cardapio',
  admin: 'Cadastro'
};

function App() {
  const [activePage, setActivePage] = useState('menu');
  const {
    categories,
    items,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    refreshMenu,
    addMenuItem,
  } = useMenu();
  const [cart, setCart] = useState({
    items: [],
    address: null
  });
  const [pedidoAtual, setPedidoAtual] = useState(() => {
    const savedPedido = window.localStorage.getItem(PEDIDO_STORAGE_KEY);

    if (!savedPedido) {
      return null;
    }

    try {
      return JSON.parse(savedPedido);
    } catch (err) {
      console.error('Nao foi possivel ler pedido salvo.', err);
      window.localStorage.removeItem(PEDIDO_STORAGE_KEY);
      return null;
    }
  });

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (!pedidoAtual?.id) {
      window.localStorage.removeItem(PEDIDO_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(PEDIDO_STORAGE_KEY, JSON.stringify(pedidoAtual));
  }, [pedidoAtual]);

  const cartCount = cart.items.length;

  async function loadCart() {
    const data = await fetchCart(CART_ID);

    setCart({
      items: data.items,
      address: data.address
    });
  }

  const handleAddToCart = async (item) => {
    await createCartItem(CART_ID, item.id);
    await loadCart();
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeCartItem(CART_ID, itemId);
      await loadCart();
    } catch (err) {
      console.error(err);
      alert('Erro ao remover item');
    }
  };

  const handleConfirmarPedido = async () => {
    const pedido = await confirmarPedido(CART_ID);
    setPedidoAtual(pedido);
    await loadCart();
    setActivePage('pedidoStatus');
  };

  const handlePedidoStatusChange = (nextStatus) => {
    setPedidoAtual((prevPedido) => {
      if (!prevPedido?.id) {
        return prevPedido;
      }

      if (prevPedido.status === nextStatus) {
        return prevPedido;
      }

      return { ...prevPedido, status: nextStatus };
    });
  };

  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        cartCount={cartCount}
        pages={pages}
        hasActivePedido={Boolean(pedidoAtual?.id && pedidoAtual?.status !== 'PEDIDO_ENTREGUE')}
      />
      <main className="page-content">
        {activePage === 'menu' && (
          <MenuPage
            categories={categories}
            items={items}
            isLoading={isLoading}
            error={error}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddToCart={handleAddToCart}
            onRetry={refreshMenu}
          />
        )}
        {activePage === 'admin' && (
          <ProductFormPage
            categories={categories}
            onSubmit={addMenuItem}
            onSuccess={() => {
              refreshMenu();
              setActivePage('menu');
            }}
          />
        )}
        {activePage === 'cart' && (
          <ShoppingCartPage items={cart.items}
            address={cart.address}
            onRemoveItem={handleRemoveFromCart}
            onAddressUpdate={loadCart}
            onConfirmarPedido={handleConfirmarPedido}
          />
        )}
        {activePage === 'pedidoStatus' && (
          <PedidoStatusPage
            pedido={pedidoAtual}
            onBackToMenu={() => setActivePage('menu')}
            onStatusChange={handlePedidoStatusChange}
          />
        )}
      </main>
    </div>
  );
}

export default App;
