-- ============================================
-- SCRIPT PARA CORREGIR USUARIOS DIRECTAMENTE
-- Ejecuta esto en phpMyAdmin
-- ============================================

-- 1. Ver usuarios actuales
SELECT 'USUARIOS ACTUALES:' as info;
SELECT id, name, email, type, active FROM users;

-- 2. Actualizar el administrador
UPDATE users 
SET 
    email = 'admin@pharma.com',
    name = 'Administrador del Sistema',
    password = '$2b$10$YourHashedPasswordHere'  -- Necesitas ejecutar el script de Node.js para el hash correcto
WHERE type = 'admin'
LIMIT 1;

-- 3. Actualizar el cliente
UPDATE users 
SET 
    email = 'cliente@demo.com',
    name = 'Juan Pérez',
    password = '$2b$10$YourHashedPasswordHere'  -- Necesitas ejecutar el script de Node.js para el hash correcto
WHERE type = 'cliente'
LIMIT 1;

-- 4. Ver usuarios después de la actualización
SELECT 'USUARIOS ACTUALIZADOS:' as info;
SELECT id, name, email, type, active FROM users;

-- ============================================
-- NOTA IMPORTANTE:
-- Este script NO incluye las contraseñas hasheadas.
-- Es mejor ejecutar: node backend/scripts/fixUsers.js
-- ============================================
