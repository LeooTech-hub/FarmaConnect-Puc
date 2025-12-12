import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

function UserManagement({ onUserUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
      
      // Notificar al componente padre
      if (onUserUpdate) {
        await onUserUpdate();
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Cargando usuarios...</div>;
  }

  return (
    <div className="inventory-table" style={{ marginTop: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>👥 Gestión de Usuarios</h3>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Fecha Registro</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><strong>#{user.id}</strong></td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`status-badge ${
                  user.type === 'admin' ? 'status-completed' : 'status-pending'
                }`}>
                  {user.type === 'admin' ? '👨‍💼 Admin' : '👤 Cliente'}
                </span>
              </td>
              <td>{new Date(user.created_at).toLocaleDateString('es-PE')}</td>
              <td>
                <span className="status-badge status-available">
                  {user.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
