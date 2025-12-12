import { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import { orderService } from '../services/orderService';

function OrderManagement({ onOrderUpdate }) {
  const { orders: contextOrders, loadOrders } = useStore();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrders(contextOrders);
  }, [contextOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await orderService.updateStatus(orderId, newStatus);
      
      // Actualizar estado local
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      // Recargar órdenes desde el servidor
      await loadOrders();
      
      // Notificar al componente padre para actualizar estadísticas
      if (onOrderUpdate) {
        await onOrderUpdate();
      }
      
      alert('Estado del pedido actualizado');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado del pedido');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="inventory-table" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>📦 Gestión de Pedidos</h3>
        <select 
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Todos los pedidos</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmados</option>
          <option value="completed">Completados</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">📦</div>
          <h3>No hay pedidos</h3>
          <p>Los pedidos de los clientes aparecerán aquí</p>
        </div>
      ) : (
        <div>
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card" style={{ marginBottom: '20px' }}>
              <div className="order-header">
                <div>
                  <div className="order-id">🆔 {order.id}</div>
                  <div style={{ color: '#666', fontSize: '0.9em', marginTop: '5px' }}>
                    📅 {new Date(order.date).toLocaleDateString('es-PE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={`order-status status-${order.status}`}>
                    {order.status === 'pending' ? '⏳ Pendiente' : 
                     order.status === 'confirmed' ? '✅ Confirmado' : 
                     '🎉 Completado'}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    style={{ 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      border: '2px solid var(--primary)',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
              </div>

              <div className="order-info-box">
                <div className="order-info-grid">
                  <div className="order-info-item">
                    <div className="order-info-label">👤 CLIENTE</div>
                    <div className="order-info-value">
                      <strong>{order.clientData.name}</strong>
                      <div className="order-info-detail">📞 {order.clientData.phone}</div>
                      <div className="order-info-detail">🆔 {order.clientData.dni}</div>
                      {order.clientData.email && (
                        <div className="order-info-detail">📧 {order.clientData.email}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="order-info-item">
                    <div className="order-info-label">📍 ENTREGA</div>
                    <div className="order-info-value">
                      <strong>{order.deliveryData.address}</strong>
                      <div className="order-info-detail">📌 {order.deliveryData.district}</div>
                      {order.deliveryData.reference && (
                        <div className="order-info-detail">🏠 {order.deliveryData.reference}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="order-info-item">
                    <div className="order-info-label">💳 PAGO</div>
                    <div className="order-info-value">
                      <strong>{order.paymentDetails.methodName}</strong>
                      <div className="order-info-detail">
                        {order.paymentDetails.method === 'contraentrega' && '💵 Efectivo al recibir'}
                        {order.paymentDetails.method === 'tarjeta' && '💳 Pago con tarjeta'}
                        {order.paymentDetails.method === 'billetera' && `📱 ${order.paymentDetails.billetera}`}
                      </div>
                    </div>
                  </div>

                  <div className="order-info-item">
                    <div className="order-info-label">👤 USUARIO</div>
                    <div className="order-info-value">
                      <strong>{order.userName}</strong>
                      <div className="order-info-detail">ID: {order.userId}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ margin: '20px 0' }}>
                <strong style={{ display: 'block', marginBottom: '15px', color: 'var(--primary)' }}>
                  📦 PRODUCTOS
                </strong>
                <table style={{ width: '100%', fontSize: '0.95em' }}>
                  <thead style={{ background: 'var(--light)' }}>
                    <tr>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Producto</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>Cantidad</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Precio Unit.</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => {
                      const price = item.oferta 
                        ? item.precio * (1 - item.oferta.discount / 100) 
                        : item.precio;
                      return (
                        <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                          <td style={{ padding: '10px' }}>
                            <strong>{item.nombre}</strong>
                            {item.oferta && (
                              <div className="offer-badge" style={{ marginTop: '5px', fontSize: '0.8em' }}>
                                {item.oferta.text}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            <strong>{item.quantity}</strong>
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                            S/ {price.toFixed(2)}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right' }}>
                            <strong style={{ color: 'var(--primary)' }}>
                              S/ {(price * item.quantity).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ 
                background: 'var(--light)', 
                padding: '15px', 
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    Subtotal: S/ {order.subtotal.toFixed(2)} | 
                    Delivery: S/ {order.delivery.toFixed(2)}
                    {order.paymentFee > 0 && ` | Recargo: S/ ${order.paymentFee.toFixed(2)}`}
                  </div>
                </div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--primary)' }}>
                  Total: S/ {order.total.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        background: 'var(--light)', 
        borderRadius: '15px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2em', marginBottom: '10px' }}>📦</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--warning)' }}>
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div style={{ color: '#666' }}>Pendientes</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2em', marginBottom: '10px' }}>✅</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--success)' }}>
            {orders.filter(o => o.status === 'confirmed').length}
          </div>
          <div style={{ color: '#666' }}>Confirmados</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2em', marginBottom: '10px' }}>🎉</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--info)' }}>
            {orders.filter(o => o.status === 'completed').length}
          </div>
          <div style={{ color: '#666' }}>Completados</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2em', marginBottom: '10px' }}>💰</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--success)' }}>
            S/ {orders.reduce((sum, order) => {
              // Si es contra entrega, solo contar si está completado
              if (order.paymentDetails.method === 'contraentrega') {
                return order.status === 'completed' ? sum + order.total : sum;
              }
              // Si es tarjeta o billetera, contar siempre (pago anticipado)
              return sum + order.total;
            }, 0).toFixed(2)}
          </div>
          <div style={{ color: '#666' }}>Ingresos Confirmados</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2em', marginBottom: '10px' }}>⏳</div>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--warning)' }}>
            S/ {orders.reduce((sum, order) => {
              // Solo contar contra entrega que NO estén completados
              if (order.paymentDetails.method === 'contraentrega' && order.status !== 'completed') {
                return sum + order.total;
              }
              return sum;
            }, 0).toFixed(2)}
          </div>
          <div style={{ color: '#666' }}>Pendientes de Cobro</div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
