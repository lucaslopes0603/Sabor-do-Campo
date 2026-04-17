import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Header({ activePage, onNavigate, cartCount, pages }) {
  return (
    <header className="topbar">
      <div className="brand-mark">
        <div className="brand-seal">SC</div>
        <div>
          <p className="eyebrow">Cardapio Digital</p>
          <h1>Sabor do Campo</h1>
        </div>
      </div>

      <nav className="topbar-nav" aria-label="Navegacao principal">
        {Object.entries(pages).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={activePage === value ? 'nav-button active' : 'nav-button'}
            onClick={() => onNavigate(value)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="cart-badge"
          aria-label={`Carrinho com ${cartCount} itens`}
          onClick={() => onNavigate('cart')}
        >
          <ShoppingCartIcon className="cart-icon" />
          <strong>{cartCount}</strong>
        </button>
      </nav>
    </header>
  );
}

export default Header;
