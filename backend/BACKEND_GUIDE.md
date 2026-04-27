# Guia Del Backend SkipLine

Este archivo explica el proposito de cada zona del backend para facilitar onboarding a personas sin contexto del proyecto.

## Flujo principal

1. AuthController recibe registro/login.
2. AuthService valida reglas de rol y emite JWT.
3. JwtAuthenticationFilter valida token en cada request protegido.
4. Controladores de dominio delegan en servicios transaccionales.
5. Repositorios encapsulan consultas de JPA.
6. GlobalExceptionHandler estandariza errores HTTP.

## Mapa por paquete

### controller
- AuthController: alta e inicio de sesion.
- UserController: administracion de usuarios y perfil propio.
- DoctorController: catalogo de doctores y agenda diaria.
- HorarioController: alta de horarios base semanales.
- SlotController: generacion masiva de slots de 30 minutos.
- CitaController: reserva transaccional de turnos.

### service
- AuthService: registro/login y politicas de rol.
- UserService: altas administrativas y proyecciones de usuario.
- DoctorService: filtros de busqueda y disponibilidad proxima.
- HorarioService: validacion de superposicion de bloques.
- SlotService: expansion de horarios base a slots concretos.
- CitaService: bloqueo de slot y creacion de cita sin doble reserva.

### Security
- SecurityConfig: rutas publicas/protegidas y configuracion stateless.
- JwtService: firma, claims y validacion de tokens.
- JwtAuthenticationFilter: integra JWT al SecurityContext.
- CustomUserDetailsService: carga usuarios para autenticacion.
- UserPrincipal: adapta Usuario a UserDetails.

### entity
- Usuario y Role: identidad y autorizacion.
- Doctor y Especialidad: catalogo medico.
- HorarioBase: disponibilidad semanal.
- Slot y SlotEstado: franjas agendables.
- Cita y CitaEstado: reserva confirmada y ciclo de vida.

### repository
- UsuarioRepository: consultas por email.
- DoctorRepository: listado con filtros y join de especialidades.
- HorarioBaseRepository: busqueda de superposicion.
- SlotRepository: agenda por fecha y bloqueo pesimista.
- CitaRepository: control de unicidad por slot.

### dto
- auth: entrada/salida de autenticacion.
- user: contratos de alta admin y perfil.
- doctor: respuesta de listado de catalogo.
- horario: alta y salida de horario base.
- slot: consulta y generacion de disponibilidad.
- cita: reserva de turnos y confirmacion.
- common: error unificado para respuestas de fallo.

### exception
- Excepciones de negocio especificas (email duplicado, superposicion, slot ocupado, etc.).
- GlobalExceptionHandler traduce excepciones a codigos HTTP estables.

## Archivos de infraestructura

- src/main/resources/application.properties: datasource, JPA validate, JWT y swagger path.
- sql/01_align_skipline_schema.sql: alineacion de esquema MySQL con el modelo JPA.
- pom.xml: dependencias y build Maven.
