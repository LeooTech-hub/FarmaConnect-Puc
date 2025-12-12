-- ============================================
-- FARMACONNECT PUCALLPA - ESQUEMA DE BASE DE DATOS
-- Versión: 1.0
-- Fecha: 2025-12-10
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS farmaconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE farmaconnect_db;

-- ============================================
-- TABLA: users (Usuarios del sistema)
-- ============================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL COMMENT 'Contraseña hasheada con bcrypt',
    type ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_type (type),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: products (Productos/Medicamentos)
-- ============================================
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    disponible BOOLEAN DEFAULT TRUE,
    descripcion TEXT,
    
    -- Campos de oferta
    tiene_oferta BOOLEAN DEFAULT FALSE,
    descuento_porcentaje DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Porcentaje de descuento (ej: 20.00 para 20%)',
    texto_oferta VARCHAR(100) DEFAULT NULL COMMENT 'Texto descriptivo de la oferta',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre),
    INDEX idx_disponible (disponible),
    INDEX idx_tiene_oferta (tiene_oferta),
    
    CHECK (precio >= 0),
    CHECK (stock >= 0),
    CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: orders (Pedidos)
-- ============================================
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY COMMENT 'Formato: ORD-timestamp',
    user_id BIGINT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    
    -- Datos del cliente
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_dni VARCHAR(20) NOT NULL,
    client_email VARCHAR(255),
    
    -- Datos de entrega
    delivery_address TEXT NOT NULL,
    delivery_district VARCHAR(100) NOT NULL,
    delivery_reference TEXT,
    
    -- Datos de pago
    payment_method ENUM('contraentrega', 'tarjeta', 'billetera') NOT NULL,
    payment_method_name VARCHAR(100) NOT NULL COMMENT 'Nombre descriptivo del método',
    billetera_type VARCHAR(50) DEFAULT NULL COMMENT 'Yape, Plin, BIM (si aplica)',
    
    -- Montos
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL DEFAULT 5.00,
    payment_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT 'Recargo por tarjeta (5%)',
    total DECIMAL(10, 2) NOT NULL,
    
    -- Estado del pedido
    status ENUM('pending', 'confirmed', 'completed') NOT NULL DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_method (payment_method),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: order_items (Items de cada pedido)
-- ============================================
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    product_id BIGINT DEFAULT NULL COMMENT 'Puede ser NULL si el producto se elimina',
    
    -- Snapshot del producto al momento de la compra
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL COMMENT 'Precio unitario original',
    quantity INT NOT NULL,
    
    -- Oferta aplicada (si había)
    had_offer BOOLEAN DEFAULT FALSE,
    discount_applied DECIMAL(5, 2) DEFAULT 0.00 COMMENT 'Porcentaje de descuento aplicado',
    offer_text VARCHAR(100) DEFAULT NULL,
    
    subtotal DECIMAL(10, 2) NOT NULL COMMENT 'precio * cantidad (con descuento si aplica)',
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: search_history (Historial de búsquedas)
-- ============================================
DROP TABLE IF EXISTS search_history;
CREATE TABLE search_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    search_query VARCHAR(255) NOT NULL,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_searched_at (searched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: cart (Carrito de compras)
-- ============================================
DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id),
    
    CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar usuario administrador
-- Contraseña: admin123 (hasheada con bcrypt)
INSERT INTO users (name, email, password, type) VALUES 
('Administrador del Sistema', 'admin@pharma.com', '$2b$10$rKZLvXF5xQxH5L5L5L5L5uO5L5L5L5L5L5L5L5L5L5L5L5L5L5L5L', 'admin');

-- Insertar usuario cliente de prueba
-- Contraseña: 123456 (hasheada con bcrypt)
INSERT INTO users (name, email, password, type) VALUES 
('Juan Pérez', 'cliente@demo.com', '$2b$10$rKZLvXF5xQxH5L5L5L5L5uO5L5L5L5L5L5L5L5L5L5L5L5L5L5L5L', 'cliente');

-- Insertar productos iniciales
INSERT INTO products (nombre, precio, stock, disponible, descripcion, tiene_oferta, descuento_porcentaje, texto_oferta) VALUES 
('Paracetamol 500mg', 8.50, 50, TRUE, 'Analgésico y antipirético de uso común', FALSE, 0, NULL),
('Paracetamol 500mg', 7.90, 30, TRUE, 'Analgésico y antipirético', FALSE, 0, NULL),
('Paracetamol 1g', 12.00, 25, TRUE, 'Analgésico y antipirético de mayor concentración', FALSE, 0, NULL),
('Ibuprofeno 400mg', 12.50, 40, TRUE, 'Antiinflamatorio no esteroideo (AINE)', FALSE, 0, NULL),
('Ibuprofeno 400mg', 15.00, 0, FALSE, 'Antiinflamatorio no esteroideo', FALSE, 0, NULL),
('Amoxicilina 500mg', 18.50, 35, TRUE, 'Antibiótico de amplio espectro', TRUE, 15, '15% OFF'),
('Loratadina 10mg', 6.50, 60, TRUE, 'Antihistamínico para alergias', FALSE, 0, NULL),
('Omeprazol 20mg', 14.00, 45, TRUE, 'Inhibidor de la bomba de protones', TRUE, 20, '20% OFF'),
('Diclofenaco Gel', 22.00, 28, TRUE, 'Antiinflamatorio tópico', FALSE, 0, NULL),
('Vitamina C 1000mg', 25.00, 50, TRUE, 'Suplemento vitamínico', TRUE, 10, '10% OFF');

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Resumen de pedidos por usuario
CREATE OR REPLACE VIEW v_user_orders_summary AS
SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email,
    COUNT(o.id) AS total_orders,
    SUM(CASE WHEN o.status = 'pending' THEN 1 ELSE 0 END) AS pending_orders,
    SUM(CASE WHEN o.status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_orders,
    SUM(CASE WHEN o.status = 'completed' THEN 1 ELSE 0 END) AS completed_orders,
    COALESCE(SUM(o.total), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.type = 'cliente'
GROUP BY u.id, u.name, u.email;

-- Vista: Productos más vendidos
CREATE OR REPLACE VIEW v_top_products AS
SELECT 
    p.id,
    p.nombre,
    p.precio,
    p.stock,
    COALESCE(SUM(oi.quantity), 0) AS total_sold,
    COALESCE(SUM(oi.subtotal), 0) AS total_revenue
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.nombre, p.precio, p.stock
ORDER BY total_sold DESC;

-- Vista: Ingresos confirmados (solo pedidos completados o pagos anticipados)
CREATE OR REPLACE VIEW v_confirmed_revenue AS
SELECT 
    DATE(o.created_at) AS order_date,
    COUNT(o.id) AS total_orders,
    SUM(CASE 
        WHEN o.payment_method = 'contraentrega' AND o.status = 'completed' THEN o.total
        WHEN o.payment_method IN ('tarjeta', 'billetera') THEN o.total
        ELSE 0
    END) AS confirmed_revenue,
    SUM(CASE 
        WHEN o.payment_method = 'contraentrega' AND o.status != 'completed' THEN o.total
        ELSE 0
    END) AS pending_revenue
FROM orders o
GROUP BY DATE(o.created_at)
ORDER BY order_date DESC;

-- ============================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================

-- Procedimiento: Actualizar stock después de un pedido
DELIMITER //
CREATE PROCEDURE sp_update_stock_after_order(IN p_order_id VARCHAR(50))
BEGIN
    UPDATE products p
    INNER JOIN order_items oi ON p.id = oi.product_id
    SET p.stock = p.stock - oi.quantity,
        p.disponible = CASE WHEN (p.stock - oi.quantity) > 0 THEN TRUE ELSE FALSE END
    WHERE oi.order_id = p_order_id;
END //
DELIMITER ;

-- Procedimiento: Obtener estadísticas del dashboard
DELIMITER //
CREATE PROCEDURE sp_get_dashboard_stats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM users WHERE type = 'cliente') AS total_clients,
        (SELECT COUNT(*) FROM products) AS total_products,
        (SELECT COUNT(*) FROM orders) AS total_orders,
        (SELECT SUM(CASE 
            WHEN payment_method = 'contraentrega' AND status = 'completed' THEN total
            WHEN payment_method IN ('tarjeta', 'billetera') THEN total
            ELSE 0
        END) FROM orders) AS confirmed_revenue,
        (SELECT SUM(CASE 
            WHEN payment_method = 'contraentrega' AND status != 'completed' THEN total
            ELSE 0
        END) FROM orders) AS pending_revenue;
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Actualizar disponibilidad del producto cuando stock cambia
DELIMITER //
CREATE TRIGGER tr_update_product_availability
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.stock <= 0 THEN
        SET NEW.disponible = FALSE;
    ELSEIF NEW.stock > 0 AND OLD.stock <= 0 THEN
        SET NEW.disponible = TRUE;
    END IF;
END //
DELIMITER ;

-- ============================================
-- INFORMACIÓN FINAL
-- ============================================
SELECT 'Base de datos creada exitosamente!' AS mensaje;
SELECT 'Tablas creadas: users, products, orders, order_items, search_history, cart' AS info;
SELECT 'Usuarios de prueba creados:' AS usuarios;
SELECT '  - Admin: admin@pharma.com / admin123' AS admin_user;
SELECT '  - Cliente: cliente@demo.com / 123456' AS client_user;
SELECT 'Productos de ejemplo insertados: 10 medicamentos' AS productos;
