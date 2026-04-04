import { useEffect, useState } from 'react';
import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import ProductFormPage from './pages/ProductFormPage';
import { useMenu } from './hooks/useMenu';
import { fetchCartItems, createCartItem, removeCartItem } from './services/cartService';
import ShoppingCartPage from './pages/ShoppingCartPage';

const CART_ID = 1; // Temporário, enquanto não tem carrinho por usuário.

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
  const [cart, setCart] = useState([]);

  useEffect(() => {
  loadCart();
}, []);

  const cartCount = cart.length;

  const loadCart = async () => {
    const data = await fetchCartItems(CART_ID);
    const formatted = data.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl
    }));

    setCart(formatted);
  };

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
          <ShoppingCartPage items={cart}
          onRemoveItem={handleRemoveFromCart}
          />
        )}
      </main>
    </div>
  );
}

export default App;
