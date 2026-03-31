import { useMemo, useState } from 'react';
import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import ProductFormPage from './pages/ProductFormPage';
import { useMenu } from './hooks/useMenu';

const pages = {
  menu: 'Cardapio',
  admin: 'Cadastro',
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

  const cartCount = useMemo(
    () => cart.reduce((total, current) => total + current.quantity, 0),
    [cart],
  );

  const handleAddToCart = (item) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...currentCart, { id: item.id, name: item.name, quantity: 1 }];
    });
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
        {activePage === 'menu' ? (
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
        ) : (
          <ProductFormPage
            categories={categories}
            onSubmit={addMenuItem}
            onSuccess={() => {
              refreshMenu();
              setActivePage('menu');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
