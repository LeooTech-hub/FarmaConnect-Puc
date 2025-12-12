import { useStore } from '../StoreContext';

function HistorySection({ setActiveSection }) {
  const { searchHistory, removeFromHistory, clearHistory } = useStore();

  const handleSearchFromHistory = (query) => {
    // Aquí podrías implementar la lógica para buscar desde el historial
    setActiveSection('buscar');
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Estás seguro de limpiar todo el historial?')) {
      clearHistory();
    }
  };

  if (searchHistory.length === 0) {
    return (
      <div className="history-container">
        <h2 style={{ marginBottom: '30px' }}>📊 Historial de Búsquedas</h2>
        <div className="cart-empty">
          <div className="cart-empty-icon">📊</div>
          <h3>Sin historial</h3>
          <p>Tus búsquedas aparecerán aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2 style={{ marginBottom: '30px' }}>📊 Historial de Búsquedas</h2>
      
      {searchHistory.map((query, index) => (
        <div 
          key={index} 
          className="history-item"
          onClick={() => handleSearchFromHistory(query)}
        >
          <div>
            <div className="history-query">🔍 {query}</div>
            <div className="history-date">Búsqueda #{index + 1}</div>
          </div>
          <button 
            className="btn-map"
            onClick={(e) => {
              e.stopPropagation();
              removeFromHistory(index);
            }}
          >
            🗑️
          </button>
        </div>
      ))}
      
      <button 
        className="btn-clear-history btn-danger"
        style={{ 
          marginTop: '20px', 
          padding: '12px 30px', 
          border: 'none', 
          borderRadius: '10px', 
          cursor: 'pointer', 
          color: 'white' 
        }}
        onClick={handleClearHistory}
      >
        🗑️ Limpiar Historial
      </button>
    </div>
  );
}

export default HistorySection;
