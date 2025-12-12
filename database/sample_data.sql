-- ============================================
-- FARMACONNECT PUCALLPA - DATOS DE EJEMPLO
-- Este archivo contiene datos adicionales para pruebas
-- ============================================

USE farmaconnect_db;

-- ============================================
-- USUARIOS ADICIONALES
-- ============================================

-- Más clientes de prueba
INSERT INTO users (name, email, password, type) VALUES 
('María García', 'maria@example.com', '$2b$10$rKZLvXF5xQxH5L5L5L5L5uO5L5L5L5L5L5L5L5L5L5L5L5L5L5L5L', 'cliente'),
('Carlos López', 'carlos@example.com', '$2b$10$rKZLvXF5xQxH5L5L5L5L5uO5L5L5L5L5L5L5L5L5L5L5L5L5L5L5L', 'cliente'),
('Ana Rodríguez', 'ana@example.com', '$2b$10$rKZLvXF5xQxH5L5L5L5L5uO5L5L5L5L5L5L5L5L5L5L5L5L5L5L5L', 'cliente');

-- ============================================
-- PRODUCTOS ADICIONALES
-- ============================================

INSERT INTO products (nombre, precio, stock, disponible, descripcion, tiene_oferta, descuento_porcentaje, texto_oferta) VALUES 
-- Analgésicos
('Aspirina 500mg', 5.50, 80, TRUE, 'Ácido acetilsalicílico', FALSE, 0, NULL),
('Naproxeno 250mg', 16.00, 35, TRUE, 'Antiinflamatorio no esteroideo', FALSE, 0, NULL),
('Tramadol 50mg', 28.00, 20, TRUE, 'Analgésico opioide', FALSE, 0, NULL),

-- Antibióticos
('Azitromicina 500mg', 32.00, 25, TRUE, 'Antibiótico macrólido', TRUE, 10, '10% OFF'),
('Ciprofloxacino 500mg', 24.00, 30, TRUE, 'Antibiótico fluoroquinolona', FALSE, 0, NULL),
('Cefalexina 500mg', 22.00, 40, TRUE, 'Antibiótico cefalosporina', FALSE, 0, NULL),

-- Antihistamínicos
('Cetirizina 10mg', 8.00, 55, TRUE, 'Antihistamínico de segunda generación', FALSE, 0, NULL),
('Difenhidramina 50mg', 12.00, 45, TRUE, 'Antihistamínico sedante', FALSE, 0, NULL),

-- Gastrointestinales
('Ranitidina 150mg', 10.50, 38, TRUE, 'Antagonista H2', FALSE, 0, NULL),
('Metoclopramida 10mg', 7.50, 42, TRUE, 'Antiemético procinético', FALSE, 0, NULL),
('Loperamida 2mg', 9.00, 50, TRUE, 'Antidiarreico', FALSE, 0, NULL),

-- Vitaminas y Suplementos
('Complejo B', 18.00, 60, TRUE, 'Vitaminas del complejo B', TRUE, 15, '15% OFF'),
('Calcio + Vitamina D', 28.00, 35, TRUE, 'Suplemento para huesos', FALSE, 0, NULL),
('Hierro 300mg', 15.00, 40, TRUE, 'Suplemento de hierro', FALSE, 0, NULL),
('Multivitamínico', 35.00, 45, TRUE, 'Vitaminas y minerales', TRUE, 20, '20% OFF'),

-- Productos tópicos
('Alcohol en Gel 250ml', 8.50, 100, TRUE, 'Desinfectante de manos', FALSE, 0, NULL),
('Crema Hidratante', 22.00, 30, TRUE, 'Hidratación profunda', FALSE, 0, NULL),
('Protector Solar SPF 50', 45.00, 25, TRUE, 'Protección UV', TRUE, 10, '10% OFF'),

-- Productos para resfriado
('Antigripal Día', 12.00, 70, TRUE, 'Alivio de síntomas de gripe', FALSE, 0, NULL),
('Antigripal Noche', 14.00, 65, TRUE, 'Alivio nocturno de gripe', FALSE, 0, NULL),
('Jarabe para la Tos', 18.50, 40, TRUE, 'Expectorante', FALSE, 0, NULL),

-- Productos cardiovasculares
('Enalapril 10mg', 15.00, 30, TRUE, 'Antihipertensivo IECA', FALSE, 0, NULL),
('Atorvastatina 20mg', 32.00, 28, TRUE, 'Estatina para colesterol', FALSE, 0, NULL),
('Aspirina Protect 100mg', 18.00, 50, TRUE, 'Antiagregante plaquetario', FALSE, 0, NULL);

-- ============================================
-- PEDIDOS DE EJEMPLO
-- ============================================

-- Pedido 1: Cliente Juan Pérez - Contra Entrega - Pendiente
INSERT INTO orders (id, user_id, user_name, client_name, client_phone, client_dni, client_email, 
                    delivery_address, delivery_district, delivery_reference,
                    payment_method, payment_method_name, billetera_type,
                    subtotal, delivery_fee, payment_fee, total, status, created_at) 
VALUES ('ORD-1702345678901', 2, 'Juan Pérez', 'Juan Pérez', '961234567', '12345678', 'cliente@demo.com',
        'Jr. Tacna 123, Calleria', 'Calleria', 'Casa azul, cerca al parque',
        'contraentrega', 'Contra Entrega', NULL,
        17.00, 5.00, 0.00, 22.00, 'pending', '2025-12-09 10:30:00');

-- Items del pedido 1
INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, had_offer, discount_applied, offer_text, subtotal)
VALUES 
('ORD-1702345678901', 1, 'Paracetamol 500mg', 8.50, 2, FALSE, 0, NULL, 17.00);

-- Pedido 2: Cliente María - Tarjeta - Confirmado
INSERT INTO orders (id, user_id, user_name, client_name, client_phone, client_dni, client_email, 
                    delivery_address, delivery_district, delivery_reference,
                    payment_method, payment_method_name, billetera_type,
                    subtotal, delivery_fee, payment_fee, total, status, created_at) 
VALUES ('ORD-1702345678902', 3, 'María García', 'María García', '987654321', '87654321', 'maria@example.com',
        'Av. Sáenz Peña 456', 'Calleria', 'Edificio verde, 2do piso',
        'tarjeta', 'Tarjeta (+ 5%)', NULL,
        50.00, 5.00, 2.50, 57.50, 'confirmed', '2025-12-08 14:20:00');

-- Items del pedido 2
INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, had_offer, discount_applied, offer_text, subtotal)
VALUES 
('ORD-1702345678902', 6, 'Amoxicilina 500mg', 18.50, 2, TRUE, 15, '15% OFF', 31.45),
('ORD-1702345678902', 8, 'Omeprazol 20mg', 14.00, 1, TRUE, 20, '20% OFF', 11.20),
('ORD-1702345678902', 7, 'Loratadina 10mg', 6.50, 1, FALSE, 0, NULL, 6.50);

-- Pedido 3: Cliente Carlos - Yape - Completado
INSERT INTO orders (id, user_id, user_name, client_name, client_phone, client_dni, client_email, 
                    delivery_address, delivery_district, delivery_reference,
                    payment_method, payment_method_name, billetera_type,
                    subtotal, delivery_fee, payment_fee, total, status, created_at) 
VALUES ('ORD-1702345678903', 4, 'Carlos López', 'Carlos López', '912345678', '11223344', 'carlos@example.com',
        'Jr. Coronel Portillo 789', 'Yarinacocha', 'Frente al mercado',
        'billetera', 'Yape', 'Yape',
        75.00, 5.00, 0.00, 80.00, 'completed', '2025-12-07 16:45:00');

-- Items del pedido 3
INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, had_offer, discount_applied, offer_text, subtotal)
VALUES 
('ORD-1702345678903', 10, 'Vitamina C 1000mg', 25.00, 2, TRUE, 10, '10% OFF', 45.00),
('ORD-1702345678903', 4, 'Ibuprofeno 400mg', 12.50, 2, FALSE, 0, NULL, 25.00);

-- Pedido 4: Cliente Ana - Contra Entrega - Completado
INSERT INTO orders (id, user_id, user_name, client_name, client_phone, client_dni, client_email, 
                    delivery_address, delivery_district, delivery_reference,
                    payment_method, payment_method_name, billetera_type,
                    subtotal, delivery_fee, payment_fee, total, status, created_at) 
VALUES ('ORD-1702345678904', 5, 'Ana Rodríguez', 'Ana Rodríguez', '998877665', '55667788', 'ana@example.com',
        'Av. Centenario 321', 'Manantay', 'Casa con reja negra',
        'contraentrega', 'Contra Entrega', NULL,
        36.00, 5.00, 0.00, 41.00, 'completed', '2025-12-06 11:15:00');

-- Items del pedido 4
INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, had_offer, discount_applied, offer_text, subtotal)
VALUES 
('ORD-1702345678904', 3, 'Paracetamol 1g', 12.00, 3, FALSE, 0, NULL, 36.00);

-- ============================================
-- HISTORIAL DE BÚSQUEDAS
-- ============================================

INSERT INTO search_history (user_id, search_query, searched_at) VALUES
(2, 'paracetamol', '2025-12-09 09:00:00'),
(2, 'ibuprofeno', '2025-12-09 09:15:00'),
(2, 'vitamina c', '2025-12-09 10:00:00'),
(3, 'amoxicilina', '2025-12-08 13:30:00'),
(3, 'omeprazol', '2025-12-08 14:00:00'),
(4, 'antigripal', '2025-12-07 15:20:00'),
(4, 'vitamina', '2025-12-07 16:00:00'),
(5, 'paracetamol', '2025-12-06 10:30:00');

-- ============================================
-- CARRITOS ACTIVOS
-- ============================================

INSERT INTO cart (user_id, product_id, quantity, added_at) VALUES
(2, 7, 2, '2025-12-10 08:00:00'),
(2, 9, 1, '2025-12-10 08:05:00'),
(3, 1, 3, '2025-12-10 07:30:00');

-- ============================================
-- CONSULTAS ÚTILES PARA VERIFICAR
-- ============================================

-- Ver todos los usuarios
SELECT 'USUARIOS REGISTRADOS:' AS info;
SELECT id, name, email, type, active FROM users;

-- Ver todos los productos
SELECT 'PRODUCTOS DISPONIBLES:' AS info;
SELECT id, nombre, precio, stock, disponible, tiene_oferta, texto_oferta FROM products LIMIT 10;

-- Ver resumen de pedidos
SELECT 'RESUMEN DE PEDIDOS:' AS info;
SELECT 
    status,
    COUNT(*) AS cantidad,
    SUM(total) AS total_monto
FROM orders
GROUP BY status;

-- Ver ingresos confirmados vs pendientes
SELECT 'ANÁLISIS DE INGRESOS:' AS info;
SELECT 
    SUM(CASE 
        WHEN payment_method = 'contraentrega' AND status = 'completed' THEN total
        WHEN payment_method IN ('tarjeta', 'billetera') THEN total
        ELSE 0
    END) AS ingresos_confirmados,
    SUM(CASE 
        WHEN payment_method = 'contraentrega' AND status != 'completed' THEN total
        ELSE 0
    END) AS pendientes_cobro
FROM orders;
