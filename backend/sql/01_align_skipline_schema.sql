-- ====================================================================
-- BASE DE DATOS: skipline
-- Propósito: Inicializar esquema de base de datos e insertar datos de prueba
-- ====================================================================

DROP DATABASE IF EXISTS skipline;
CREATE DATABASE skipline;
USE skipline;

-- ====================================================================
-- 1. TABLAS PRINCIPALES (Sujetos y Entidades Base)
-- ====================================================================

-- CLINICA: Almacena la información de las sedes o centros médicos.
CREATE TABLE clinica (
  id bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(150) NOT NULL,
  direccion varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

-- ESPECIALIDAD: Almacena las especialidades médicas ofrecidas.
CREATE TABLE especialidad (
  id bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  descripcion varchar(255),
  PRIMARY KEY (id)
);

-- USUARIO: Cuentas de acceso para Pacientes, Médicos y Administradores.
CREATE TABLE usuario (
  id bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(120) NOT NULL,
  email varchar(150) NOT NULL,
  password varchar(255) NOT NULL,
  rol varchar(20) NOT NULL DEFAULT 'PACIENTE',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
);

-- ====================================================================
-- 2. TABLAS RELACIONADAS A DOCTORES
-- ====================================================================

-- DOCTOR: Perfiles médicos asociados a una clínica.
CREATE TABLE doctor (
  id bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  apellido varchar(100) NOT NULL,
  experiencia_anios int,
  consultorio varchar(50),
  foto_url varchar(255),
  clinica_id bigint NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (clinica_id) REFERENCES clinica(id)
);

-- DOCTOR_ESPECIALIDAD: Relación muchos-a-muchos entre doctores y especialidades.
CREATE TABLE doctor_especialidad (
  doctor_id bigint NOT NULL,
  especialidad_id bigint NOT NULL,
  PRIMARY KEY (doctor_id, especialidad_id),
  FOREIGN KEY (doctor_id) REFERENCES doctor(id),
  FOREIGN KEY (especialidad_id) REFERENCES especialidad(id)
);

-- HORARIO_BASE: Bloques de atención semanal teóricos para cada doctor.
CREATE TABLE horario_base (
  id bigint NOT NULL AUTO_INCREMENT,
  doctor_id bigint NOT NULL,
  dia_semana int NOT NULL,
  hora_inicio time NOT NULL,
  hora_fin time NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);

-- ====================================================================
-- 3. GESTIÓN DE CITAS Y DISPONIBILIDAD (SLOTS)
-- ====================================================================

-- SLOT: Bloques de tiempo reales generados para citas médicas.
CREATE TABLE slot (
  id bigint NOT NULL AUTO_INCREMENT,
  doctor_id bigint NOT NULL,
  fecha date NOT NULL,
  hora_inicio time NOT NULL,
  hora_fin time NOT NULL,
  estado varchar(20) NOT NULL DEFAULT 'DISPONIBLE',
  PRIMARY KEY (id),
  FOREIGN KEY (doctor_id) REFERENCES doctor(id)
);

-- CITA: Reservas de citas médicas realizadas por los usuarios en slots específicos.
CREATE TABLE cita (
  id bigint NOT NULL AUTO_INCREMENT,
  usuario_id bigint NOT NULL,
  slot_id bigint NOT NULL,
  estado varchar(20) NOT NULL DEFAULT 'RESERVADA',
  motivo varchar(255),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_cita_slot (slot_id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id),
  FOREIGN KEY (slot_id) REFERENCES slot(id)
);

-- ====================================================================
-- 4. INSERCIÓN DE DATOS DE PRUEBA (SEED DATA)
-- ====================================================================

-- Clínica SkipLine
INSERT INTO clinica (id, nombre, direccion) VALUES 
(1, 'Clinica SkipLine', 'Av. Principal 123');

-- Especialidades
INSERT INTO especialidad (id, nombre, descripcion) VALUES
(1, 'Cardiología', 'Corazón y sistema cardiovascular'),
(2, 'Pediatría', 'Atención de niños'),
(3, 'Dermatología', 'Piel y enfermedades cutáneas'),
(4, 'Medicina General', 'Atención primaria general');

-- Doctores
INSERT INTO doctor (id, nombre, apellido, experiencia_anios, consultorio, foto_url, clinica_id) VALUES
(1, 'Carlos', 'Rodríguez', 15, '301', NULL, 1),
(2, 'Ana', 'Martínez', 12, '205', NULL, 1),
(3, 'Luis', 'Fernández', 20, '402', NULL, 1);

-- Relación Doctor - Especialidad
INSERT INTO doctor_especialidad (doctor_id, especialidad_id) VALUES
(1, 1), -- Dr. Carlos Rodríguez -> Cardiología
(2, 2), -- Dra. Ana Martínez -> Pediatría
(3, 3); -- Dr. Luis Fernández -> Dermatología

-- Usuario de prueba (Paciente)
INSERT INTO usuario (id, nombre, email, password, rol, created_at) VALUES
(1, 'Johan Dioses', 'johandiosesrazuri@gmail.com', 'password', 'PACIENTE', NOW());

-- Horarios Base de Atención
INSERT INTO horario_base (doctor_id, dia_semana, hora_inicio, hora_fin) VALUES
-- Dr. Carlos Rodríguez (Lunes a Viernes, 9:00 AM - 5:00 PM)
(1, 1, '09:00:00', '17:00:00'),
(1, 2, '09:00:00', '17:00:00'),
(1, 3, '09:00:00', '17:00:00'),
(1, 4, '09:00:00', '17:00:00'),
(1, 5, '09:00:00', '17:00:00'),

-- Dra. Ana Martínez (Lunes, Miércoles y Viernes, 10:00 AM - 6:00 PM)
(2, 1, '10:00:00', '18:00:00'),
(2, 3, '10:00:00', '18:00:00'),
(2, 5, '10:00:00', '18:00:00'),

-- Dr. Luis Fernández (Martes y Jueves, 2:00 PM - 7:00 PM)
(3, 2, '14:00:00', '19:00:00'),
(3, 4, '14:00:00', '19:00:00');

-- Slots de atención disponibles
INSERT INTO slot (id, doctor_id, fecha, hora_inicio, hora_fin, estado) VALUES
-- Dr. Carlos Rodríguez
(1, 1, '2026-06-03', '09:00:00', '09:30:00', 'DISPONIBLE'),
(2, 1, '2026-06-03', '09:30:00', '10:00:00', 'DISPONIBLE'),
(3, 1, '2026-06-03', '10:00:00', '10:30:00', 'DISPONIBLE'),

-- Dra. Ana Martínez
(4, 2, '2026-06-03', '10:00:00', '10:30:00', 'DISPONIBLE'),
(5, 2, '2026-06-03', '10:30:00', '11:00:00', 'DISPONIBLE'),

-- Dr. Luis Fernández
(6, 3, '2026-06-04', '14:00:00', '14:30:00', 'DISPONIBLE'),
(7, 3, '2026-06-04', '14:30:00', '15:00:00', 'DISPONIBLE');

-- Cita reservada
INSERT INTO cita (usuario_id, slot_id, estado, motivo) VALUES 
(1, 1, 'RESERVADA', 'Dolor de cabeza frecuente');

-- ====================================================================
-- 5. VERIFICACIÓN DE DATOS
-- ====================================================================
SHOW TABLES;
SELECT * FROM clinica;
SELECT * FROM especialidad;
SELECT * FROM doctor;
SELECT * FROM usuario;