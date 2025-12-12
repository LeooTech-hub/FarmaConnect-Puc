# 📊 Base de Datos - FarmaConnect Pucallpa

## 📁 Archivos Incluidos

1. **farmaconnect_schema.sql** - Esquema completo de la base de datos
2. **sample_data.sql** - Datos de ejemplo para pruebas (opcional)

---

## 🚀 Instrucciones de Importación en phpMyAdmin

### Método 1: Importación Completa (Recomendado)

1. **Abrir phpMyAdmin**
   - Accede a: `http://localhost/phpmyadmin`
   - Usuario: `root` (por defecto)
   - Contraseña: (vacía o la que configuraste)

2. **Importar el esquema principal**
   - Click en la pestaña **"Importar"** en el menú superior
   - Click en **"Seleccionar archivo"**
   - Selecciona: `farmaconnect_schema.sql`
   - Asegúrate que el formato sea: **SQL**
   - Click en **"Continuar"** al final de la página
   - ✅ Espera el mensaje: "Importación finalizada correctamente"

3. **Importar datos de ejemplo (Opcional)**
   - Selecciona la base de datos `farmaconnect_db` en el panel izquierdo
   - Click en la pestaña **"Importar"**
   - Selecciona: `sample_data.sql`
   - Click en **"Continuar"**

### Método 2: Importación Manual

Si prefieres crear la base de datos primero:

1. **Crear la base de datos**
   - En phpMyAdmin, click en **"Nueva"** en el panel izquierdo
   - Nombre: `farmaconnect_db`
   - Cotejamiento: `utf8mb4_unicode_ci`
   - Click en **"Crear"**

2. **Importar las tablas**
   - Selecciona `farmaconnect_db`
   - Click en **"Importar"**
   - Selecciona `farmaconnect_schema.sql`
   - Click en **"Continuar"**

---

## 📋 Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción | Registros Iniciales |
|-------|-------------|---------------------|
| `users` | Usuarios del sistema (admin/cliente) | 2 usuarios |
| `products` | Medicamentos y productos | 10 productos |
| `orders` | Pedidos realizados | 0 (4 con sample_data) |
| `order_items` | Detalles de productos en pedidos | 0 (9 con sample_data) |
| `search_history` | Historial de búsquedas | 0 (8 con sample_data) |
| `cart` | Carritos de compra activos | 0 (3 con sample_data) |

### Vistas Creadas

- `v_user_orders_summary` - Resumen de pedidos por usuario
- `v_top_products` - Productos más vendidos
- `v_confirmed_revenue` - Ingresos confirmados por fecha

### Procedimientos Almacenados

- `sp_update_stock_after_order` - Actualiza stock después de un pedido
- `sp_get_dashboard_stats` - Obtiene estadísticas del dashboard

### Triggers

- `tr_update_product_availability` - Actualiza disponibilidad según stock

---

## 👤 Usuarios de Prueba

### Administrador
```
Email: admin@pharma.com
Contraseña: admin123
```

### Cliente
```
Email: cliente@demo.com
Contraseña: 123456
```

### Clientes Adicionales (con sample_data.sql)
```
Email: maria@example.com
Contraseña: 123456

Email: carlos@example.com
Contraseña: 123456

Email: ana@example.com
Contraseña: 123456
```

---

## 🔍 Consultas Útiles

### Ver todos los usuarios
```sql
SELECT id, name, email, type, active FROM users;
```

### Ver productos disponibles
```sql
SELECT nombre, precio, stock, disponible 
FROM products 
WHERE disponible = TRUE 
ORDER BY nombre;
```

### Ver pedidos por estado
```sql
SELECT status, COUNT(*) as cantidad, SUM(total) as total_monto
FROM orders
GROUP BY status;
```

### Ver ingresos confirmados
```sql
SELECT 
    SUM(CASE 
        WHEN payment_method = 'contraentrega' AND status = 'completed' THEN total
        WHEN payment_method IN ('tarjeta', 'billetera') THEN total
        ELSE 0
    END) AS ingresos_confirmados
FROM orders;
```

### Ver productos más vendidos
```sql
SELECT * FROM v_top_products LIMIT 10;
```

### Obtener estadísticas del dashboard
```sql
CALL sp_get_dashboard_stats();
```

---

## ⚠️ Notas Importantes

### Contraseñas
Las contraseñas en el archivo SQL están hasheadas con **bcrypt**. En tu aplicación real debes:

1. Instalar bcrypt:
```bash
npm install bcrypt
```

2. Hashear contraseñas al registrar:
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

3. Verificar contraseñas al login:
```javascript
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Configuración de Conexión

Ejemplo de conexión con Node.js (mysql2):

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'farmaconnect_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### Índices
Los índices ya están creados para optimizar:
- Búsquedas por email
- Filtros por tipo de usuario
- Búsquedas de productos
- Consultas de pedidos por estado
- Historial ordenado por fecha

---

## 🔧 Mantenimiento

### Backup de la Base de Datos

**Desde phpMyAdmin:**
1. Selecciona `farmaconnect_db`
2. Click en **"Exportar"**
3. Método: **Rápido**
4. Formato: **SQL**
5. Click en **"Continuar"**

**Desde línea de comandos:**
```bash
mysqldump -u root -p farmaconnect_db > backup_farmaconnect.sql
```

### Restaurar Backup
```bash
mysql -u root -p farmaconnect_db < backup_farmaconnect.sql
```

### Limpiar Datos de Prueba
```sql
-- Eliminar pedidos de prueba
DELETE FROM orders WHERE id LIKE 'ORD-170234567890%';

-- Eliminar búsquedas
TRUNCATE TABLE search_history;

-- Vaciar carritos
TRUNCATE TABLE cart;
```

---

## 📞 Soporte

Si encuentras algún error durante la importación:

1. Verifica que MySQL esté corriendo
2. Verifica los permisos del usuario
3. Asegúrate de usar MySQL 5.7+ o MariaDB 10.2+
4. Revisa el log de errores de phpMyAdmin

---

## ✅ Verificación Post-Importación

Ejecuta estas consultas para verificar que todo está correcto:

```sql
-- Verificar tablas creadas
SHOW TABLES;

-- Verificar usuarios
SELECT COUNT(*) as total_users FROM users;

-- Verificar productos
SELECT COUNT(*) as total_products FROM products;

-- Verificar vistas
SHOW FULL TABLES WHERE TABLE_TYPE LIKE 'VIEW';

-- Verificar procedimientos
SHOW PROCEDURE STATUS WHERE Db = 'farmaconnect_db';
```

Deberías ver:
- ✅ 6 tablas
- ✅ 2 usuarios (5 con sample_data)
- ✅ 10 productos (40 con sample_data)
- ✅ 3 vistas
- ✅ 2 procedimientos almacenados
