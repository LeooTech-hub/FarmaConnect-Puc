import { useStore } from '../StoreContext';

function Navbar({ activeSection, setActiveSection, isAdmin = false }) {
  const { currentUser, logout, cart } = useStore();
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">💊 FarmaConnect Pucallpa</div>
        
        <div className="navbar-menu">
          {!isAdmin && (
            <>
              <div 
                className={`nav-item ${activeSection === 'buscar' ? 'active' : ''}`}
                onClick={() => setActiveSection('buscar')}
              >
                🔍 Buscar
              </div>
              <div 
                className={`nav-item cart-badge ${activeSection === 'carrito' ? 'active' : ''}`}
                onClick={() => setActiveSection('carrito')}
              >
                🛒 Carrito
                <span className="cart-count">{cartCount}</span>
              </div>
              <div 
                className={`nav-item ${activeSection === 'ordenes' ? 'active' : ''}`}
                onClick={() => setActiveSection('ordenes')}
              >
                📦 Órdenes
              </div>
              <div 
                className={`nav-item ${activeSection === 'historial' ? 'active' : ''}`}
                onClick={() => setActiveSection('historial')}
              >
                📊 Historial
              </div>
            </>
          )}
          
          <div className="user-badge">
            <div className="user-avatar">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <span>{currentUser?.name}</span>
          </div>
          
          <div className="nav-item" onClick={handleLogout}>
            🚪 Salir
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
