import { useState } from 'react';
import { useStore } from '../StoreContext';

function ProductManagement() {
  const { products, addProduct, editProduct, deleteProduct } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    descripcion: '',
    hasOffer: false,
    discount: '',
    offerText: ''
  });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        precio: product.precio,
        stock: product.stock,
        descripcion: product.descripcion || '',
        hasOffer: !!product.oferta,
        discount: product.oferta?.discount || '',
        offerText: product.oferta?.text || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        precio: '',
        stock: '',
        descripcion: '',
        hasOffer: false,
        discount: '',
        offerText: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      nombre: formData.nombre,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      descripcion: formData.descripcion,
      oferta: formData.hasOffer ? {
        discount: parseFloat(formData.discount),
        text: formData.offerText || `${formData.discount}% OFF`
      } : null
    };

    if (editingProduct) {
      editProduct(editingProduct.id, productData);
      alert('Producto actualizado');
    } else {
      addProduct(productData);
      alert('Producto agregado');
    }
    
    setShowModal(false);
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(productId);
      alert('Producto eliminado');
    }
  };

  return (
    <div className="inventory-table" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>💊 Inventario de Medicamentos</h3>
        <button 
          className="btn btn-success btn-small"
          onClick={() => handleOpenModal()}
        >
          ➕ Agregar Producto
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Oferta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td><strong>{product.nombre}</strong></td>
              <td>S/ {product.precio.toFixed(2)}</td>
              <td>
                <strong>{product.stock}</strong> {product.stock <= 2 && product.stock > 0 ? '⚠️' : ''}
              </td>
              <td>
                <span className={`status-badge ${product.disponible && product.stock > 0 ? 'status-available' : 'status-unavailable'}`}>
                  {product.disponible && product.stock > 0 ? 'Disponible' : 'Agotado'}
                </span>
              </td>
              <td>
                {product.oferta ? (
                  <span className="offer-badge">{product.oferta.text}</span>
                ) : (
                  'Sin oferta'
                )}
              </td>
              <td>
                <button 
                  className="btn btn-small btn-success"
                  style={{ marginRight: '5px' }}
                  onClick={() => handleOpenModal(product)}
                >
                  ✏️
                </button>
                <button 
                  className="btn btn-small btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal active" onClick={(e) => e.target.className === 'modal active' && setShowModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              {editingProduct ? '✏️ Editar Producto' : '➕ Agregar Producto'}
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre del Medicamento *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    placeholder="Paracetamol 500mg"
                  />
                </div>

                <div className="form-group">
                  <label>Precio (S/) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                    placeholder="10.50"
                  />
                </div>

                <div className="form-group">
                  <label>Stock (unidades) *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    placeholder="50"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción del Producto</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción opcional del medicamento..."
                  />
                </div>

                <div className="form-group">
                  <label>¿Tiene oferta?</label>
                  <select
                    value={formData.hasOffer ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, hasOffer: e.target.value === 'yes' })}
                  >
                    <option value="no">No</option>
                    <option value="yes">Sí</option>
                  </select>
                </div>

                {formData.hasOffer && (
                  <>
                    <div className="form-group">
                      <label>Descuento (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        placeholder="20"
                      />
                    </div>

                    <div className="form-group">
                      <label>Texto de la Oferta</label>
                      <input
                        type="text"
                        value={formData.offerText}
                        onChange={(e) => setFormData({ ...formData, offerText: e.target.value })}
                        placeholder="20% OFF"
                      />
                    </div>
                  </>
                )}

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    💾 Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
