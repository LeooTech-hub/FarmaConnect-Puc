import { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import Navbar from '../components/Navbar';
import ProductManagement from '../components/ProductManagement';
import UserManagement from '../components/UserManagement';
import OrderManagement from '../components/OrderManagement';
import { userService } from '../services/userService';

function AdminPanel() {
  const [activeSection, setActiveSection] = useState('productos');
  const { products, orders, loadProducts, loadOrders } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      // Cargar todos los datos en paralelo
      await Promise.all([
        loadUsers(),
        loadProducts(),
        loadOrders()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const clientes = users.filter(u => u.type === 'cliente');
  
  // Calcular ingresos: solo pedidos completados o pagos anticipados (tarjeta/billetera)
  const totalRevenue = orders.reduce((sum, order) => {
    // Si es contra entrega, solo contar si está completado
    if (order.paymentDetails.method === 'contraentrega') {
      return order.status === 'completed' ? sum + order.total : sum;
    }
    // Si es tarjeta o billetera, contar siempre (pago anticipado)
    return sum + order.total;
  }, 0);

  if (loading) {
    return (
      <div className="app-container active">
        <Navbar activeSection="admin" setActiveSection={setActiveSection} isAdmin={true} />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3em', marginBottom: '20px' }}>⏳</div>
            <h3>Cargando datos del panel...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container active">
      <Navbar activeSection="admin" setActiveSection={setActiveSection} isAdmin={true} />
      
      <div className="main-content">
        <h2 style={{ marginBottom: '30px' }}>👨‍💼 Panel de Administración</h2>

        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Usuarios</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-value">{clientes.length}</div>
            <div className="stat-label">Clientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💊</div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Productos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Total Pedidos</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">S/ {totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Ingresos Totales</div>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <div className="auth-tabs">
            <div 
              className={`auth-tab ${activeSection === 'pedidos' ? 'active' : ''}`}
              onClick={() => setActiveSection('pedidos')}
            >
              Pedidos
            </div>
            <div 
              className={`auth-tab ${activeSection === 'productos' ? 'active' : ''}`}
              onClick={() => setActiveSection('productos')}
            >
              Productos
            </div>
            <div 
              className={`auth-tab ${activeSection === 'usuarios' ? 'active' : ''}`}
              onClick={() => setActiveSection('usuarios')}
            >
              Usuarios
            </div>
          </div>

          {activeSection === 'pedidos' && <OrderManagement onOrderUpdate={loadAllData} />}
          {activeSection === 'productos' && <ProductManagement />}
          {activeSection === 'usuarios' && <UserManagement onUserUpdate={loadUsers} />}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
