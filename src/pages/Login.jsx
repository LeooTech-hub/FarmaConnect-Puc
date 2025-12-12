import { useState, useEffect } from 'react';
import { useStore } from '../StoreContext';
import Loading from '../components/Loading';

function Login() {
  const { login, register, loading } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    type: 'cliente'
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        alert(result.message);
      }
    } else {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.type
      });
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {loading && <Loading />}
      <div className="auth-container">
        <div className="auth-box">
        <div className="auth-logo">
          <h1>💊 FarmaConnect Pucallpa</h1>
          <p>Sistema Integral de búsqueda de medicamentos</p>
        </div>

        <div className="auth-tabs">
          <div 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </div>
          <div 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </div>
        </div>

        {isLogin ? (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Iniciar Sesión
              </button>
            </form>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Juan Pérez"
                />
              </div>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ejemplo@correo.com"
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Registrarse
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default Login;
