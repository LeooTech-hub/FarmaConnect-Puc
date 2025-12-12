import { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';

function SearchSection() {
  const { products, addToCart, addToSearchHistory, currentUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortPrice, setSortPrice] = useState('');

  // Mostrar todos los productos al cargar
  useEffect(() => {
    if (products.length > 0) {
      applyFilters(products);
    }
  }, [products]);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    if (searchQuery === '') {
      applyFilters(products);
    }
  }, [availabilityFilter, sortPrice]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    
    if (query === '') {
      // Si está vacío, mostrar todos los productos
      applyFilters(products);
      return;
    }

    // Guardar en historial solo si hay usuario
    if (currentUser) {
      addToSearchHistory(query);
    }

    // Buscar en nombre y descripción
    const results = products.filter(p => 
      p.nombre.toLowerCase().includes(query) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(query))
    );
    
    applyFilters(results);
  };

  const applyFilters = (results) => {
    let filtered = [...results];

    // Filtro de disponibilidad
    if (availabilityFilter === 'available') {
      filtered = filtered.filter(p => p.disponible && p.stock > 0);
    } else if (availabilityFilter === 'unavailable') {
      filtered = filtered.filter(p => !p.disponible || p.stock === 0);
    }

    // Ordenar por precio
    if (sortPrice === 'asc') {
      filtered.sort((a, b) => a.precio - b.precio);
    } else if (sortPrice === 'desc') {
      filtered.sort((a, b) => b.precio - a.precio);
    }

    setFilteredResults(filtered);
  };

  const handleAddToCart = (productId) => {
    const result = addToCart(productId);
    alert(result.message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Búsqueda en tiempo real
    if (value.trim() === '') {
      applyFilters(products);
    } else {
      const query = value.toLowerCase().trim();
      const results = products.filter(p => 
        p.nombre.toLowerCase().includes(query) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(query))
      );
      applyFilters(results);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    applyFilters(products);
  };

  return (
    <div className="section active">
      <div className="search-hero">
        <h2 style={{ marginBottom: '20px' }}>Buscar Medicamentos</h2>
        
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Buscar medicamento (ej: Paracetamol, Ibuprofeno...)"
          />
          {searchQuery && (
            <button 
              className="search-btn" 
              onClick={clearSearch}
              style={{ background: '#f44336', marginRight: '10px' }}
            >
              ✕ Limpiar
            </button>
          )}
          <button className="search-btn" onClick={handleSearch}>
            🔍 Buscar
          </button>
        </div>

        <div className="filters">
          <select 
            className="filter-select"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="available">Disponible</option>
            <option value="unavailable">Agotado</option>
          </select>
          
          <select 
            className="filter-select"
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
          >
            <option value="">Ordenar por precio</option>
            <option value="asc">Menor a mayor</option>
            <option value="desc">Mayor a menor</option>
          </select>
        </div>

        {/* Contador de resultados */}
        <div style={{ marginTop: '15px', color: '#666', fontSize: '0.95em' }}>
          {filteredResults.length > 0 ? (
            <span>📊 Mostrando <strong>{filteredResults.length}</strong> producto{filteredResults.length !== 1 ? 's' : ''}</span>
          ) : (
            <span>❌ No se encontraron productos</span>
          )}
        </div>
      </div>

      <div className="products-grid">
        {filteredResults.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">💊</div>
            <h3>No se encontraron productos</h3>
            <p>{searchQuery ? `No hay resultados para "${searchQuery}"` : 'No hay productos disponibles'}</p>
            {searchQuery && (
              <button 
                className="btn btn-primary" 
                onClick={clearSearch}
                style={{ marginTop: '20px' }}
              >
                Ver todos los productos
              </button>
            )}
          </div>
        ) : (
          filteredResults.map(product => {
            const finalPrice = product.oferta 
              ? product.precio * (1 - product.oferta.discount / 100) 
              : product.precio;
            const isAvailable = product.disponible && product.stock > 0;
            const stockWarning = product.stock > 0 && product.stock <= 5;

            return (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <div className="product-name">{product.nombre}</div>
                  <span className={`status-badge ${isAvailable ? 'status-available' : 'status-unavailable'}`}>
                    {isAvailable ? '✓ Disponible' : '✗ Agotado'}
                  </span>
                </div>
                
                {product.oferta && (
                  <div className="offer-badge">🎉 {product.oferta.text}</div>
                )}
                
                <div className="product-price">
                  {product.oferta && (
                    <span className="original-price">S/ {product.precio.toFixed(2)}</span>
                  )}
                  S/ {finalPrice.toFixed(2)}
                </div>
                
                <div style={{ 
                  background: 'var(--light)', 
                  padding: '15px', 
                  borderRadius: '10px', 
                  margin: '15px 0' 
                }}>
                  <div className="product-info" style={{ marginBottom: '8px' }}>
                    💰 <strong>Precio:</strong> S/ {finalPrice.toFixed(2)}
                  </div>
                  <div className="product-info" style={{ 
                    marginBottom: '8px',
                    color: stockWarning ? 'var(--warning)' : 'inherit'
                  }}>
                    📦 <strong>Stock:</strong> {product.stock} unidades
                    {stockWarning && ' ⚠️ Pocas unidades'}
                  </div>
                  {product.descripcion && (
                    <div className="product-info" style={{ 
                      fontSize: '0.9em', 
                      color: '#666',
                      marginTop: '10px',
                      paddingTop: '10px',
                      borderTop: '1px solid #ddd'
                    }}>
                      📝 {product.descripcion}
                    </div>
                  )}
                </div>
                
                <div className="product-actions">
                  <button
                    className="btn-add-cart"
                    disabled={!isAvailable}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    {!isAvailable ? '✗ No Disponible' : '🛒 Agregar al Carrito'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SearchSection;
