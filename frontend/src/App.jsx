import { useEffect, useState } from 'react';
import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import ProductFormPage from './pages/ProductFormPage';
import { useMenu } from './hooks/useMenu';
import { fetchCart, createCartItem, removeCartItem } from './services/cartService';
import ShoppingCartPage from './pages/ShoppingCartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const CART_ID = 1; // Temporário, enquanto não tem carrinho por usuário.

const pages = {
  menu: 'Cardapio',
  admin: 'Cadastro',
  login: "Entrar",
  register: "Registro"
};

function App() {
  const [activePage, setActivePage] = useState('menu');
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    loadCart();
  }, []);

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

  function handleLogin() {
    setUser({ name: "Usuário" });
    setActivePage('menu');
  }

  function handleLogout() {
    setUser(null);
    setActivePage('menu');
  }


  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        cartCount={cartCount}
        pages={pages}
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
          />
        )}
        {activePage === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}
        {activePage === 'register' && (
          <RegisterPage />
        )}
      </main>
    </div>
  );
}

export default App;
