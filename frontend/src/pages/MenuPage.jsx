import { useMemo, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import MenuItemCard from '../components/MenuItemCard';
import SearchBar from '../components/SearchBar';

function MenuPage({
  categories,
  items,
  isLoading,
  error,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  onRetry,
}) {
  const [search, setSearch] = useState('');

  const groupedItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filteredItems = items.filter((item) => {
      if (!normalizedSearch) {
        return true;
      }

      return [item.name, item.description, item.ingredients.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
    });

    return filteredItems.reduce((groups, item) => {
      if (!groups[item.categoryLabel]) {
        groups[item.categoryLabel] = [];
      }
      groups[item.categoryLabel].push(item);
      return groups;
    }, {});
  }, [items, search]);

  const sections = Object.entries(groupedItems);

  return (
    <section className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">Sabores do Campo</p>
        <h2>Cardapio do Produto</h2>
        <p>
          Uma vitrine leve e elegante para entradas, pratos principais, sobremesas e
          bebidas, inspirada no visual organico da sua referencia.
        </p>
      </div>

      <div className="menu-panel">
        <div className="menu-toolbar">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onChange={onCategoryChange}
          />
        </div>

        {isLoading ? <p className="feedback-message">Carregando cardapio...</p> : null}

        {!isLoading && error ? (
          <div className="feedback-card">
            <p>{error}</p>
            <button type="button" onClick={onRetry}>
              Tentar novamente
            </button>
          </div>
        ) : null}

        {!isLoading && !error && sections.length === 0 ? (
          <div className="feedback-card">
            <p>Nenhum item encontrado com os filtros atuais.</p>
          </div>
        ) : null}

        {!isLoading && !error ? (
          <div className="menu-sections">
            {sections.map(([sectionName, sectionItems]) => (
              <section key={sectionName} className="menu-section">
                <div className="section-heading">
                  <h3>{sectionName}</h3>
                  <span>{sectionItems.length} opcoes</span>
                </div>

                <div className="menu-grid">
                  {sectionItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default MenuPage;
