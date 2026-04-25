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
ALTER TABLE Usuario
    ADD CONSTRAINT chk_usuario_rol
    CHECK (rol IN ('ADMIN', 'MEDICO', 'PACIENTE'));

ALTER TABLE Slot
    ADD CONSTRAINT chk_slot_estado
    CHECK (estado IN ('DISPONIBLE', 'RESERVADO', 'CANCELADO'));

ALTER TABLE Cita
    ADD CONSTRAINT chk_cita_estado
    CHECK (estado IN ('RESERVADA', 'CONFIRMADA', 'ATENDIDA', 'CANCELADA'));

ALTER TABLE HorarioBase
    ADD CONSTRAINT chk_horario_dia_semana
    CHECK (dia_semana BETWEEN 1 AND 7);

ALTER TABLE HorarioBase
    ADD CONSTRAINT chk_horario_horas
    CHECK (hora_inicio < hora_fin);

ALTER TABLE Slot
    ADD CONSTRAINT chk_slot_horas
    CHECK (hora_inicio < hora_fin);

-- 5) Índices recomendados para consultas comunes
CREATE INDEX idx_usuario_email ON Usuario(email);
CREATE INDEX idx_cita_usuario ON Cita(usuario_id);
CREATE INDEX idx_cita_estado ON Cita(estado);
CREATE INDEX idx_slot_estado_fecha ON Slot(estado, fecha);
