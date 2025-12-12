# 💊 FarmaConnect Pucallpa

Sistema integral de búsqueda de medicamentos en farmacias y boticas de Pucallpa.

## 🌟 Características

- 🔐 **Autenticación segura** con JWT y bcrypt
- 👨‍💼 **Panel de Administración** para gestión de productos y pedidos
- 🛒 **Carrito de compras** con múltiples métodos de pago
- 📦 **Gestión de pedidos** con estados (pendiente, confirmado, completado)
- 💰 **Control de ingresos** diferenciado por método de pago
- 🔍 **Búsqueda de productos** con filtros
- 📊 **Historial de búsquedas** por usuario
- 💊 **Gestión de inventario** con alertas de stock bajo
- 🎁 **Sistema de ofertas** y descuentos

## 🏗️ Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │─────▶│  Express API    │─────▶│  MySQL Database │
│  (Vite)         │      │  (Node.js)      │      │                 │
│  Port: 5173     │◀─────│  Port: 3001     │◀─────│  Port: 3306     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🚀 Inicio Rápido

### 1. Clonar e Instalar

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..
```

### 2. Configurar Base de Datos

1. Importar `database/farmaconnect_schema.sql` en phpMyAdmin
2. (Opcional) Importar `database/sample_data.sql` para datos de prueba

### 3. Configurar Variables de Entorno

```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

### 4. Iniciar Aplicación

```bash
# Opción 1: Iniciar todo junto
npm run start:all

# Opción 2: Por separado
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev
```

### 5. Acceder

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001

## 👤 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@pharma.com | admin123 |
| Cliente | cliente@demo.com | 123456 |

## 📁 Estructura del Proyecto

```
farmaconnect-react/
├── backend/                    # Backend API
│   ├── config/
│   │   └── database.js        # Configuración MySQL
│   ├── routes/
│   │   ├── auth.js           # Autenticación
│   │   ├── products.js       # Productos
│   │   ├── orders.js         # Pedidos
│   │   ├── users.js          # Usuarios
│   │   ├── search.js         # Búsquedas
│   │   └── cart.js           # Carrito
│   ├── .env                  # Variables de entorno
│   ├── server.js             # Servidor principal
│   └── package.json
│
├── database/                  # Scripts SQL
│   ├── farmaconnect_schema.sql
│   ├── sample_data.sql
│   └── README_DATABASE.md
│
├── src/                       # Frontend React
│   ├── components/           # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── SearchSection.jsx
│   │   ├── CartSection.jsx
│   │   ├── CheckoutModal.jsx
│   │   ├── OrdersSection.jsx
│   │   ├── HistorySection.jsx
│   │   ├── ProductManagement.jsx
│   │   ├── UserManagement.jsx
│   │   └── OrderManagement.jsx
│   ├── pages/                # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Tienda.jsx
│   │   └── AdminPanel.jsx
│   ├── services/             # Servicios API (crear)
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── orderService.js
│   ├── StoreContext.jsx      # Estado global
│   ├── App.jsx               # Rutas
│   └── index.css             # Estilos
│
├── INTEGRATION_GUIDE.md      # Guía de integración
├── START_HERE.md             # Inicio rápido
└── README.md                 # Este archivo
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/search?q=query` - Buscar productos
- `POST /api/products` - Crear producto (Admin)
- `PUT /api/products/:id` - Actualizar producto (Admin)
- `DELETE /api/products/:id` - Eliminar producto (Admin)

### Pedidos
- `GET /api/orders` - Listar todos los pedidos (Admin)
- `GET /api/orders/user/:userId` - Pedidos de un usuario
- `POST /api/orders` - Crear pedido
- `PATCH /api/orders/:id/status` - Actualizar estado (Admin)

### Usuarios
- `GET /api/users` - Listar usuarios (Admin)
- `GET /api/users/stats` - Estadísticas del dashboard

### Búsquedas
- `POST /api/search/history` - Guardar búsqueda
- `GET /api/search/history/:userId` - Obtener historial
- `DELETE /api/search/history/:userId` - Limpiar historial

### Carrito
- `GET /api/cart/:userId` - Obtener carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/:userId/:productId` - Actualizar cantidad
- `DELETE /api/cart/:userId/:productId` - Eliminar del carrito

## 🛠️ Tecnologías

### Frontend
- React 18
- Vite
- React Router DOM
- Context API
- Axios (para instalar)

### Backend
- Node.js
- Express
- MySQL2
- JWT (jsonwebtoken)
- Bcrypt
- CORS

### Base de Datos
- MySQL 5.7+
- Procedimientos almacenados
- Triggers
- Vistas

## 📊 Modelo de Datos

### Tablas Principales
- `users` - Usuarios del sistema
- `products` - Medicamentos y productos
- `orders` - Pedidos realizados
- `order_items` - Detalles de productos en pedidos
- `search_history` - Historial de búsquedas
- `cart` - Carritos de compra

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación JWT
- ✅ Tokens con expiración
- ✅ CORS configurado
- ✅ Validación de datos
- ✅ Prepared statements (SQL injection protection)

## 📝 Próximos Pasos

1. [ ] Conectar frontend con backend (ver `INTEGRATION_GUIDE.md`)
2. [ ] Instalar axios: `npm install axios`
3. [ ] Crear servicios de API
4. [ ] Actualizar StoreContext
5. [ ] Probar todas las funcionalidades

## 🐛 Solución de Problemas

Ver `START_HERE.md` para soluciones comunes.

## 📚 Documentación

- **Backend:** `backend/README.md`
- **Base de Datos:** `database/README_DATABASE.md`
- **Integración:** `INTEGRATION_GUIDE.md`
- **Inicio Rápido:** `START_HERE.md`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado para FarmaConnect Pucallpa

---

**¿Listo para empezar?** 🚀

```bash
npm run start:all
```

Luego abre http://localhost:5173 y comienza a usar el sistema!
