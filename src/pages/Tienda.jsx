import { useState } from 'react';
import { useStore } from '../StoreContext';
import Navbar from '../components/Navbar';
import SearchSection from '../components/SearchSection';
import CartSection from '../components/CartSection';
import OrdersSection from '../components/OrdersSection';
import HistorySection from '../components/HistorySection';

function Tienda() {
  const [activeSection, setActiveSection] = useState('buscar');

  return (
    <div className="app-container active">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="main-content">
        {activeSection === 'buscar' && <SearchSection />}
        {activeSection === 'carrito' && <CartSection />}
        {activeSection === 'ordenes' && <OrdersSection />}
        {activeSection === 'historial' && <HistorySection setActiveSection={setActiveSection} />}
      </div>
    </div>
  );
}

export default Tienda;
