import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './services/authService';
import { productService } from './services/productService';
import { orderService } from './services/orderService';
import { searchService } from './services/searchService';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe usarse dentro de StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar usuario actual
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Cargar productos desde la API
  useEffect(() => {
    loadProducts();
  }, []);

  // Cargar órdenes cuando el usuario cambia
  useEffect(() => {
    if (currentUser) {
      loadOrders();
      loadSearchHistory();
      // Cargar carrito desde localStorage (temporal)
      const userData = JSON.parse(localStorage.getItem(`userData_${currentUser.id}`) || '{}');
      setCart(userData.cart || []);
    }
  }, [currentUser]);

  // Función para cargar productos
  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      // Fallback a localStorage si falla la API
      const saved = localStorage.getItem('globalMedicamentos');
      if (saved) {
        setProducts(JSON.parse(saved));
      }
    }
  };

  // Función para cargar órdenes
  const loadOrders = async () => {
    try {
      if (currentUser.type === 'admin') {
        const data = await orderService.getAll();
        setOrders(data);
      } else {
        const data = await orderService.getByUser(currentUser.id);
        setOrders(data);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
      // Fallback a localStorage
      const userData = JSON.parse(localStorage.getItem(`userData_${currentUser.id}`) || '{}');
      setOrders(userData.orders || []);
    }
  };

  // Función para cargar historial de búsquedas
  const loadSearchHistory = async () => {
    try {
      const data = await searchService.getHistory(currentUser.id);
      setSearchHistory(data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      // Fallback a localStorage
      const userData = JSON.parse(localStorage.getItem(`userData_${currentUser.id}`) || '{}');
      setSearchHistory(userData.searchHistory || []);
    }
  };

  // Guardar datos del usuario en localStorage (temporal para carrito)
  const saveUserData = () => {
    if (currentUser) {
      const userData = { cart };
      localStorage.setItem(`userData_${currentUser.id}`, JSON.stringify(userData));
    }
  };

  useEffect(() => {
    saveUserData();
  }, [cart]);

  // Login con API
  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Register con API
  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await authService.register(userData);
      setCurrentUser(data.user);
      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al registrar usuario' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
    setSearchHistory([]);
  };

  // Agregar al carrito
  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.disponible || product.stock === 0) {
      return { success: false, message: 'Producto no disponible' };
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        return { success: false, message: 'No hay suficiente stock' };
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    return { success: true, message: 'Producto agregado al carrito' };
  };

  // Actualizar cantidad
  const updateQuantity = (index, change) => {
    const item = cart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      setCart(cart.filter((_, i) => i !== index));
    } else if (newQuantity > item.stock) {
      return { success: false, message: 'No hay suficiente stock' };
    } else {
      setCart(cart.map((item, i) => 
        i === index ? { ...item, quantity: newQuantity } : item
      ));
    }
    return { success: true };
  };

  // Remover del carrito
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Confirmar orden con API
  const confirmOrder = async (orderData) => {
    try {
      setLoading(true);

      const subtotal = cart.reduce((sum, item) => {
        const price = item.oferta ? item.precio * (1 - item.oferta.discount / 100) : item.precio;
        return sum + (price * item.quantity);
      }, 0);

      const delivery = 5.00;
      const paymentFee = orderData.paymentDetails.method === 'tarjeta' ? subtotal * 0.05 : 0;
      const total = subtotal + delivery + paymentFee;

      const fullOrderData = {
        userId: currentUser.id,
        userName: currentUser.name,
        items: cart,
        subtotal,
        delivery,
        paymentFee,
        total,
        ...orderData
      };

      await orderService.create(fullOrderData);
      
      setCart([]);
      await loadProducts(); // Recargar productos para actualizar stock
      await loadOrders(); // Recargar órdenes
      
      return { success: true };
    } catch (error) {
      console.error('Error al crear pedido:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al crear pedido' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Agregar búsqueda al historial con API
  const addToSearchHistory = async (query) => {
    if (!searchHistory.includes(query)) {
      const newHistory = [query, ...searchHistory].slice(0, 20);
      setSearchHistory(newHistory);
      
      // Guardar en la API
      try {
        await searchService.saveHistory(currentUser.id, query);
      } catch (error) {
        console.error('Error al guardar búsqueda:', error);
      }
    }
  };

  // Remover del historial
  const removeFromHistory = (index) => {
    setSearchHistory(searchHistory.filter((_, i) => i !== index));
  };

  // Limpiar historial con API
  const clearHistory = async () => {
    try {
      await searchService.clearHistory(currentUser.id);
      setSearchHistory([]);
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      setSearchHistory([]);
    }
  };

  // Admin: Agregar producto con API
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      await productService.create(productData);
      await loadProducts();
      return { success: true };
    } catch (error) {
      console.error('Error al crear producto:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al crear producto' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Admin: Editar producto con API
  const editProduct = async (productId, productData) => {
    try {
      setLoading(true);
      await productService.update(productId, productData);
      await loadProducts();
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al actualizar producto' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Admin: Eliminar producto con API
  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      await productService.delete(productId);
      await loadProducts();
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al eliminar producto' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    cart,
    orders,
    searchHistory,
    products,
    loading,
    login,
    register,
    logout,
    addToCart,
    updateQuantity,
    removeFromCart,
    confirmOrder,
    addToSearchHistory,
    removeFromHistory,
    clearHistory,
    addProduct,
    editProduct,
    deleteProduct,
    loadProducts,
    loadOrders
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
