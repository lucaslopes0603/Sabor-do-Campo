import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logoImage from '../assets/imgs/logo.svg';

  
  function Header({ activePage, onNavigate, cartCount, pages, hasActivePedido, user }) {
  return (
    <header className="topbar">
      <div className="brand-mark">
        <div className="brand-seal" aria-hidden="true">
          <img src={logoImage} alt="logoheader" />
        </div>
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

        {hasActivePedido && (
          <button
            type="button"
            className={activePage === 'pedidoStatus' ? 'nav-button active' : 'nav-button'}
            onClick={() => onNavigate('pedidoStatus')}
          >
            Pedido
          </button>
        )}

        <button
          type="button"
          className="cart-badge"
          aria-label={`Carrinho com ${cartCount} itens`}
          onClick={() => onNavigate('cart')}
        >
          <ShoppingCartIcon className="cart-icon" />
          <strong>{cartCount}</strong>
        </button>
        <button
          type="button"
          className="person-badge"
          aria-label="Acessar conta"
          onClick={() => onNavigate(user ? 'profile' : 'login')}
        >
          <PersonIcon className="person-icon" />
        </button>
      </nav>
    </header>
  );
}

export default Header;
