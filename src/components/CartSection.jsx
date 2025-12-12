import { useState } from 'react';
import { useStore } from '../StoreContext';
import CheckoutModal from './CheckoutModal';

function CartSection() {
  const { cart, updateQuantity, removeFromCart } = useStore();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleUpdateQuantity = (index, change) => {
    const result = updateQuantity(index, change);
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleRemove = (index) => {
    removeFromCart(index);
  };

  const total = cart.reduce((sum, item) => {
    const price = item.oferta ? item.precio * (1 - item.oferta.discount / 100) : item.precio;
    return sum + (price * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2 style={{ marginBottom: '30px' }}>🛒 Mi Carrito</h2>
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos para continuar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 style={{ marginBottom: '30px' }}>🛒 Mi Carrito</h2>
      
      <div className="cart-items">
        {cart.map((item, index) => {
          const price = item.oferta ? item.precio * (1 - item.oferta.discount / 100) : item.precio;
          
          return (
            <div key={index} className="cart-item">
              <div className="cart-item-info">
                <div className="cart-item-name">{item.nombre}</div>
                {item.oferta && (
                  <div className="offer-badge" style={{ marginTop: '8px' }}>
                    {item.oferta.text}
                  </div>
                )}
              </div>
              
              <div className="cart-item-quantity">
                <button 
                  className="qty-btn"
                  onClick={() => handleUpdateQuantity(index, -1)}
                >
                  -
                </button>
                <span className="qty-display">{item.quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => handleUpdateQuantity(index, 1)}
                >
                  +
                </button>
              </div>
              
              <div className="cart-item-price">
                S/ {(price * item.quantity).toFixed(2)}
              </div>
              
              <button 
                className="btn-remove"
                onClick={() => handleRemove(index)}
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery:</span>
          <span>S/ 5.00</span>
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <span>S/ {(total + 5).toFixed(2)}</span>
        </div>
        <button 
          className="btn-checkout"
          onClick={() => setShowCheckout(true)}
        >
          💳 Proceder al Pago
        </button>
      </div>

      {showCheckout && (
        <CheckoutModal 
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}

export default CartSection;
