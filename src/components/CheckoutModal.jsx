import { useState } from 'react';
import { useStore } from '../StoreContext';

function CheckoutModal({ onClose }) {
  const { currentUser, cart, confirmOrder } = useStore();
  const [formData, setFormData] = useState({
    clientName: currentUser?.name || '',
    clientPhone: '',
    clientDNI: '',
    clientEmail: currentUser?.email || '',
    deliveryAddress: '',
    deliveryDistrict: '',
    deliveryReference: '',
    paymentMethod: '',
    billeteraType: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.paymentMethod === 'billetera' && !formData.billeteraType) {
      alert('Por favor selecciona una billetera digital');
      return;
    }

    const orderData = {
      clientData: {
        name: formData.clientName,
        phone: formData.clientPhone,
        dni: formData.clientDNI,
        email: formData.clientEmail
      },
      deliveryData: {
        address: formData.deliveryAddress,
        district: formData.deliveryDistrict,
        reference: formData.deliveryReference
      },
      paymentDetails: {
        method: formData.paymentMethod,
        methodName: formData.paymentMethod === 'contraentrega' 
          ? 'Contra Entrega' 
          : formData.paymentMethod === 'tarjeta' 
          ? 'Tarjeta (+ 5%)' 
          : formData.billeteraType,
        billetera: formData.billeteraType
      }
    };

    const result = confirmOrder(orderData);
    if (result.success) {
      alert('¡Pedido confirmado exitosamente! 🎉');
      onClose();
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.oferta ? item.precio * (1 - item.oferta.discount / 100) : item.precio;
    return sum + (price * item.quantity);
  }, 0);

  const delivery = 5.00;
  const paymentFee = formData.paymentMethod === 'tarjeta' ? subtotal * 0.05 : 0;
  const total = subtotal + delivery + paymentFee;

  return (
    <div className="modal active" onClick={(e) => e.target.className === 'modal active' && onClose()}>
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">🛍️ Completar Pedido</div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div style={{ background: 'var(--light)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>📋 Datos del Cliente</h3>
              
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  placeholder="Juan Pérez"
                />
              </div>
              
              <div className="form-group">
                <label>Teléfono / Celular *</label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  required
                  placeholder="961234567"
                />
              </div>
              
              <div className="form-group">
                <label>DNI / Documento *</label>
                <input
                  type="text"
                  name="clientDNI"
                  value={formData.clientDNI}
                  onChange={handleChange}
                  required
                  placeholder="12345678"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div style={{ background: 'var(--light)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>📍 Dirección de Entrega</h3>
              
              <div className="form-group">
                <label>Dirección Completa *</label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                  placeholder="Jr. Tacna 123, Calleria"
                />
              </div>
              
              <div className="form-group">
                <label>Distrito *</label>
                <select
                  name="deliveryDistrict"
                  value={formData.deliveryDistrict}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar distrito...</option>
                  <option value="Calleria">Calleria</option>
                  <option value="Yarinacocha">Yarinacocha</option>
                  <option value="Manantay">Manantay</option>
                  <option value="San Fernando">San Fernando</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Referencia</label>
                <input
                  type="text"
                  name="deliveryReference"
                  value={formData.deliveryReference}
                  onChange={handleChange}
                  placeholder="Casa azul, cerca al parque"
                />
              </div>
            </div>

            <div style={{ background: 'var(--light)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: 'var(--primary)' }}>💳 Método de Pago</h3>
              
              <div className={`payment-option ${formData.paymentMethod === 'contraentrega' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="contraentrega"
                  id="payContraentrega"
                  checked={formData.paymentMethod === 'contraentrega'}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="payContraentrega">
                  <div className="payment-header">
                    <span className="payment-icon">💵</span>
                    <div>
                      <strong>Pago Contra Entrega</strong>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>Paga en efectivo al recibir</div>
                    </div>
                  </div>
                </label>
              </div>

              <div className={`payment-option ${formData.paymentMethod === 'tarjeta' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="tarjeta"
                  id="payTarjeta"
                  checked={formData.paymentMethod === 'tarjeta'}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="payTarjeta">
                  <div className="payment-header">
                    <span className="payment-icon">💳</span>
                    <div>
                      <strong>Pago con Tarjeta</strong>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>Adicional 5% de recargo</div>
                    </div>
                  </div>
                </label>
              </div>

              <div className={`payment-option ${formData.paymentMethod === 'billetera' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="billetera"
                  id="payBilletera"
                  checked={formData.paymentMethod === 'billetera'}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="payBilletera">
                  <div className="payment-header">
                    <span className="payment-icon">📱</span>
                    <div>
                      <strong>Billeteras Digitales</strong>
                      <div style={{ fontSize: '0.85em', color: '#666' }}>Yape, Plin, BIM</div>
                    </div>
                  </div>
                </label>
              </div>

              {formData.paymentMethod === 'billetera' && (
                <div style={{ marginTop: '15px', padding: '15px', background: 'white', borderRadius: '10px', border: '2px solid var(--primary)' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Selecciona tu billetera:
                  </label>
                  <select
                    name="billeteraType"
                    value={formData.billeteraType}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Yape">Yape</option>
                    <option value="Plin">Plin</option>
                    <option value="BIM">BIM</option>
                  </select>
                </div>
              )}
            </div>

            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '20px', borderRadius: '15px', color: 'white' }}>
              <h3 style={{ marginBottom: '15px', borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '10px' }}>
                📦 Resumen de Compra
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                {cart.map((item, index) => {
                  const price = item.oferta ? item.precio * (1 - item.oferta.discount / 100) : item.precio;
                  return (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95em' }}>
                      <span>{item.nombre} (x{item.quantity})</span>
                      <strong>S/ {(price * item.quantity).toFixed(2)}</strong>
                    </div>
                  );
                })}
              </div>
              
              <div style={{ borderTop: '2px solid rgba(255,255,255,0.3)', paddingTop: '15px' }}>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>🚚 Delivery:</span>
                  <span>S/ {delivery.toFixed(2)}</span>
                </div>
                {paymentFee > 0 && (
                  <div className="summary-row" style={{ color: '#ffeb3b' }}>
                    <span>🏦 Recargo tarjeta (5%):</span>
                    <span>S/ {paymentFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-total" style={{ fontSize: '1.5em', marginTop: '15px' }}>
                  <span>Total a Pagar:</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                ✅ Confirmar Pedido
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
