import { useStore } from '../StoreContext';

function OrdersSection() {
  const { orders } = useStore();

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h2 style={{ marginBottom: '30px' }}>📦 Mis Órdenes</h2>
        <div className="cart-empty">
          <div className="cart-empty-icon">📦</div>
          <h3>No tienes órdenes</h3>
          <p>Tus compras aparecerán aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2 style={{ marginBottom: '30px' }}>📦 Mis Órdenes</h2>
      
      {orders.map(order => (
        <div key={order.id} className="order-card">
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
            <span className={`order-status status-${order.status}`}>
              {order.status === 'pending' ? '⏳ Pendiente' : 
               order.status === 'confirmed' ? '✅ Confirmado' : 
               '🎉 Completado'}
            </span>
          </div>

          <div className="order-info-box">
            <div className="order-info-grid">
              <div className="order-info-item">
                <div className="order-info-label">👤 CLIENTE</div>
                <div className="order-info-value">
                  <strong>{order.clientData.name}</strong>
                  <div className="order-info-detail">📞 {order.clientData.phone}</div>
                  <div className="order-info-detail">🆔 {order.clientData.dni}</div>
                </div>
              </div>
              
              <div className="order-info-item">
                <div className="order-info-label">📍 ENTREGA</div>
                <div className="order-info-value">
                  <strong>{order.deliveryData.address}</strong>
                  <div className="order-info-detail">📌 {order.deliveryData.district}</div>
                </div>
              </div>
              
              <div className="order-info-item">
                <div className="order-info-label">💳 PAGO</div>
                <div className="order-info-value">
                  <strong>{order.paymentDetails.methodName}</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ margin: '20px 0' }}>
            <strong style={{ display: 'block', marginBottom: '15px', color: 'var(--primary)' }}>
              📦 PRODUCTOS
            </strong>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong>{item.nombre}</strong>
                    <div style={{ color: '#666', fontSize: '0.9em' }}>
                      Cant: {item.quantity}
                    </div>
                  </div>
                  <strong style={{ color: 'var(--primary)' }}>
                    S/ {(item.precio * item.quantity).toFixed(2)}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            Total: S/ {order.total.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersSection;
