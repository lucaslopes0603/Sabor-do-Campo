import CartItemCard from '../components/CartItemCard';

function ShoppingCartPage({
  items,
  onRemoveItem
}) {

  const DEFAULT_SHIPPING_PRICE = 10
    
  const total = items.reduce((sum, item) => sum + item.price, 0) + DEFAULT_SHIPPING_PRICE;

  return (
    <section className="hero-card">
      <div className="hero-copy">
        <h2>Seu Carrinho</h2>
      </div>

      <div className="menu-panel">
        {items.length === 0 ? (
          <p>Carrinho vazio</p>
        ) : (
          <>
          <div className="cart-list">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} onRemove={onRemoveItem} />
            ))}
          </div>
          <div className="cart-total">
            <h3>Total (R$ {DEFAULT_SHIPPING_PRICE.toFixed(2).replace('.', ',')} de Frete)</h3>
            <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
          </div>
        </>
      )}
      </div>
    </section>
  );
}

export default ShoppingCartPage;
