-- Ajuste de esquema existente para alinear con backend Spring Boot
-- Ejecutar en MySQL sobre la BD skipline

USE skipline;

-- 1) Normalizar datos para poder aplicar restricciones sin errores
UPDATE Usuario
SET rol = 'PACIENTE'
WHERE rol IS NULL OR rol NOT IN ('ADMIN', 'MEDICO', 'PACIENTE');

UPDATE Usuario
SET nombre = 'Sin nombre'
WHERE nombre IS NULL OR TRIM(nombre) = '';

UPDATE Usuario
SET email = CONCAT('sin-email-', id, '@skipline.local')
WHERE email IS NULL OR TRIM(email) = '';

UPDATE Usuario
SET password = '$2a$10$7EqJtq98hPqEX7fNZaFWoOHiq9B8f5Vf3L7hIwrKyYVJZZzKzbwQm'
WHERE password IS NULL OR TRIM(password) = '';

-- 2) Alinear estructura de Usuario con la entidad JPA
ALTER TABLE Usuario
    MODIFY nombre VARCHAR(120) NOT NULL,
    MODIFY email VARCHAR(150) NOT NULL,
    MODIFY password VARCHAR(255) NOT NULL,
    MODIFY rol VARCHAR(20) NOT NULL DEFAULT 'PACIENTE',
    MODIFY created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 3) Endurecer tablas del dominio para integridad de datos
ALTER TABLE Clinica
    MODIFY nombre VARCHAR(150) NOT NULL,
    MODIFY direccion VARCHAR(255) NOT NULL;

ALTER TABLE Doctor
    MODIFY nombre VARCHAR(100) NOT NULL,
    MODIFY apellido VARCHAR(100) NOT NULL,
    MODIFY clinica_id BIGINT NOT NULL;

ALTER TABLE Especialidad
    MODIFY nombre VARCHAR(100) NOT NULL;

ALTER TABLE HorarioBase
    MODIFY doctor_id BIGINT NOT NULL,
    MODIFY dia_semana INT NOT NULL,
    MODIFY hora_inicio TIME NOT NULL,
    MODIFY hora_fin TIME NOT NULL;

ALTER TABLE Slot
    MODIFY doctor_id BIGINT NOT NULL,
    MODIFY fecha DATE NOT NULL,
    MODIFY hora_inicio TIME NOT NULL,
    MODIFY hora_fin TIME NOT NULL,
    MODIFY estado VARCHAR(20) NOT NULL DEFAULT 'DISPONIBLE';

ALTER TABLE Cita
    MODIFY usuario_id BIGINT NOT NULL,
    MODIFY slot_id BIGINT NOT NULL,
    MODIFY estado VARCHAR(20) NOT NULL DEFAULT 'RESERVADA';

-- 4) Checks de valores válidos (MySQL 8+)
SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND constraint_name = 'chk_usuario_rol'
      AND table_name = 'Usuario'
);
SET @sql := IF(@exists = 0,
    'ALTER TABLE Usuario ADD CONSTRAINT chk_usuario_rol CHECK (rol IN (''ADMIN'', ''MEDICO'', ''PACIENTE''))',
    'SELECT ''chk_usuario_rol ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND constraint_name = 'chk_slot_estado'
      AND table_name = 'Slot'
);
SET @sql := IF(@exists = 0,
    'ALTER TABLE Slot ADD CONSTRAINT chk_slot_estado CHECK (estado IN (''DISPONIBLE'', ''OCUPADO'', ''RESERVADO'', ''CANCELADO''))',
    'SELECT ''chk_slot_estado ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND constraint_name = 'chk_cita_estado'
      AND table_name = 'Cita'
);
SET @sql := IF(@exists = 0,
    'ALTER TABLE Cita ADD CONSTRAINT chk_cita_estado CHECK (estado IN (''RESERVADA'', ''CONFIRMADA'', ''ATENDIDA'', ''CANCELADA''))',
    'SELECT ''chk_cita_estado ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND constraint_name = 'chk_horario_dia_semana'
      AND table_name = 'HorarioBase'
);
SET @sql := IF(@exists = 0,
    'ALTER TABLE HorarioBase ADD CONSTRAINT chk_horario_dia_semana CHECK (dia_semana BETWEEN 1 AND 7)',
    'SELECT ''chk_horario_dia_semana ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND constraint_name = 'chk_horario_horas'
      AND table_name = 'HorarioBase'
);
SET @sql := IF(@exists = 0,
    'ALTER TABLE HorarioBase ADD CONSTRAINT chk_horario_horas CHECK (hora_inicio < hora_fin)',
    'SELECT ''chk_horario_horas ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.table_constraints
    WHERE constraint_schema = DATABASE()
      AND constraint_name = 'chk_slot_horas'
      AND table_name = 'Slot'
);
SET @sql := IF(@exists = 0,
    'ALTER TABLE Slot ADD CONSTRAINT chk_slot_horas CHECK (hora_inicio < hora_fin)',
    'SELECT ''chk_slot_horas ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 5) Índices recomendados para consultas comunes
SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'Usuario'
      AND index_name = 'idx_usuario_email'
);
SET @sql := IF(@exists = 0,
    'CREATE INDEX idx_usuario_email ON Usuario(email)',
    'SELECT ''idx_usuario_email ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'Cita'
      AND index_name = 'idx_cita_usuario'
);
SET @sql := IF(@exists = 0,
    'CREATE INDEX idx_cita_usuario ON Cita(usuario_id)',
    'SELECT ''idx_cita_usuario ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'Cita'
      AND index_name = 'idx_cita_estado'
);
SET @sql := IF(@exists = 0,
    'CREATE INDEX idx_cita_estado ON Cita(estado)',
    'SELECT ''idx_cita_estado ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exists := (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'Slot'
      AND index_name = 'idx_slot_estado_fecha'
);
SET @sql := IF(@exists = 0,
    'CREATE INDEX idx_slot_estado_fecha ON Slot(estado, fecha)',
    'SELECT ''idx_slot_estado_fecha ya existe''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 6) Renombrar tablas para consistencia con JPA
RENAME TABLE DoctorEspecialidad TO doctor_especialidad;
RENAME TABLE HorarioBase TO horario_base;

--Datos ficticios para la tabla Doctor
INSERT INTO Doctor (nombre, apellido, experiencia_anios, consultorio, foto_url, clinica_id) VALUES
('Carlos', 'Rodríguez', 15, '301', 'https://via.placeholder.com/150?text=Carlos', 1),
('Ana', 'Martínez', 12, '205', 'https://via.placeholder.com/150?text=Ana', 1),
('Luis', 'Fernández', 20, '402', 'https://via.placeholder.com/150?text=Luis', 1)
;

--Datos ficticios para la tabla Especialidad
-- Dr. Carlos Rodríguez -> Cardiología
INSERT INTO Doctor_Especialidad (doctor_id, especialidad_id) 
SELECT d.id, e.id FROM Doctor d, Especialidad e 
WHERE d.nombre='Carlos' AND d.apellido='Rodríguez' AND e.nombre='Cardiología'
ON DUPLICATE KEY UPDATE doctor_id=doctor_id;

-- Dra. Ana Martínez -> Pediatría
INSERT INTO Doctor_Especialidad (doctor_id, especialidad_id) 
SELECT d.id, e.id FROM Doctor d, Especialidad e 
WHERE d.nombre='Ana' AND d.apellido='Martínez' AND e.nombre='Pediatría'
ON DUPLICATE KEY UPDATE doctor_id=doctor_id;

-- Dr. Luis Fernández -> Neurología
INSERT INTO Doctor_Especialidad (doctor_id, especialidad_id) 
SELECT d.id, e.id FROM Doctor d, Especialidad e 
WHERE d.nombre='Luis' AND d.apellido='Fernández' AND e.nombre='Neurología'
ON DUPLICATE KEY UPDATE doctor_id=doctor_id;