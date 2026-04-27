import { useEffect, useState } from 'react';
import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import ProductFormPage from './pages/ProductFormPage';
import { useMenu } from './hooks/useMenu';
import { fetchCart, createCartItem, removeCartItem } from './services/cartService';
import ShoppingCartPage from './pages/ShoppingCartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

const pages = {
  menu: 'Cardapio',
  admin: 'Cadastro'
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
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
  }, []);

  useEffect(() => {
    if (user) loadCart();
  }, [user]);

  useEffect(() => {
    if(!user) {
      const saved = localStorage.getItem('guest_cart');
      if (saved) setCart(JSON.parse(saved));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const cartCount = cart.items.length;

  async function loadCart() {
    const data = await fetchCart();

    if(!data) {
      setCart({
        items: [],
        address: null
      });
      return;
    }

    setCart({
      items: data.items ?? [],
      address: data.address ?? null
    });
  }

  const handleAddToCart = async (item) => {
    if (!user) {
      setCart(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      return;
    }
    await createCartItem(item.id);
    await loadCart();
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeCartItem(itemId);
      await loadCart();
    } catch (err) {
      console.error(err);
      alert('Erro ao remover item');
    }
  };

  async function handleLogin(userData) {
    setUser(userData);
    for (const item of cart.items) {
      await createCartItem(item.id);
    }
    
    setCart({ items: [], address: null });
    localStorage.removeItem('guest_cart');
    await loadCart();
    setActivePage('menu');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    setCart({ items: [], address: null });
    setActivePage('menu');
  }


  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        cartCount={cartCount}
        pages={pages}
        user={user}
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
        {activePage === 'profile' && (
          <ProfilePage onLogout={handleLogout} onNavigate={setActivePage} />
        )}
        {activePage === 'register' && (
          <RegisterPage onNavigate={setActivePage} />
        )}
        {activePage === 'login' && (
          <LoginPage onLogin={handleLogin} onNavigate={setActivePage} />
        )}
      </main>
    </div>
  );
}

export default App;
