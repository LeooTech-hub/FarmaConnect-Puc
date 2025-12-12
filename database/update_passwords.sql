-- ============================================
-- ACTUALIZAR CONTRASEÑAS CON HASH BCRYPT
-- ============================================

USE farmaconnect_db;

-- Actualizar contraseña del admin (admin123)
UPDATE users 
SET password = '$2b$10$a2VcurDCnE.ZM3dT0IJMKug0dRIIH1nZ1c.Yc1HIcY9X9bTdGVjlO'
WHERE email = 'admin@pharma.com';

-- Actualizar contraseña del cliente (123456)
UPDATE users 
SET password = '$2b$10$fZkLvu67gy1YLREahR3feummXtlHBIuCnYQOZtayIJavuylOFakWO'
WHERE email = 'cliente@demo.com';

-- Verificar actualización
SELECT id, name, email, type, 
       SUBSTRING(password, 1, 20) as password_hash 
FROM users;
