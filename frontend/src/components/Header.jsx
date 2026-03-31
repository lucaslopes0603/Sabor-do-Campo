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
        <div className="cart-badge" aria-label={`Carrinho com ${cartCount} itens`}>
          <span className="cart-icon" aria-hidden="true">??</span>
          <strong>{cartCount}</strong>
        </div>
      </nav>
    </header>
  );
}

export default Header;
