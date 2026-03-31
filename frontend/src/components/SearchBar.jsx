function SearchBar({ value, onChange }) {
  return (
    <label className="search-wrapper" htmlFor="menu-search">
      <span className="search-label">Buscar item</span>
      <input
        id="menu-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Pesquise por nome ou ingrediente"
      />
    </label>
  );
}

export default SearchBar;
