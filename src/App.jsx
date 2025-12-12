import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './StoreContext';
import Login from './pages/Login';
import Tienda from './pages/Tienda';
import AdminPanel from './pages/AdminPanel';

function AppRoutes() {
  const { currentUser } = useStore();

  return (
    <Routes>
      <Route 
        path="/" 
        element={!currentUser ? <Login /> : <Navigate to={currentUser.type === 'admin' ? '/admin' : '/tienda'} />} 
      />
      <Route 
        path="/tienda" 
        element={currentUser && currentUser.type === 'cliente' ? <Tienda /> : <Navigate to="/" />} 
      />
      <Route 
        path="/admin" 
        element={currentUser && currentUser.type === 'admin' ? <AdminPanel /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <StoreProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StoreProvider>
  );
}

export default App;
