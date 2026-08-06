-- V7__Fix_Demo_Accounts.sql
-- Las cuentas sembradas por V3/V5 usan hashes sin contraseña conocida (o
-- inválidos). Para poder probar login real, se fijan contraseñas conocidas
-- en las dos cuentas demo. En producción, reemplazar estos hash antes de
-- publicar o eliminar este seed.
--
--   admin@abrazamente.cl           -> Admin1234
--   paciente.demostrativo@abrazamente.cl -> Demo1234

UPDATE usuarios
SET password_hash = '$2a$10$3KbjjGiJUPJBgpwJlDQ8IuKNrc9Ec0ZmbXzYppceQJWzLXDeX/SV2'
WHERE email = 'admin@abrazamente.cl';

UPDATE usuarios
SET password_hash = '$2a$10$8ycdaoYb76whkRhxYQwn.Ol6Sp0ImVw3SH/auQx5w8tQqRAWCg/ra'
WHERE email = 'paciente.demostrativo@abrazamente.cl';
