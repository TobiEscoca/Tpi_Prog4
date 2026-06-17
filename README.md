# Integrantes: 

Tobías Escoca
Martín Calandra

/////
Solución organizada siguiendo el patrón de Clean Architecture dividida en 4 proyectos:

GestorDeTurnos.Domain — entidades y enums
GestorDeTurnos.Application — interfaces y contratos
GestorDeTurnos.Infrastructure — implementaciones, contexto y repositorios
GestorDeTurnos (API) — controladores y configuración

Lo que está hecho
Domain

Entidades: Usuario, Complejo, Cancha, Turno, Notificacion
Enums: RolUsuario, EstadoTurno

Application

Interfaz genérica IGenericRepository<T> con métodos GetAllAsync, GetByIdAsync, AddAsync, UpdateAsync y DeleteAsync

Infrastructure

ApplicationDbContext con todos los DbSets y configuración de relaciones y restricciones via Fluent API
GenericRepository<T> implementando IGenericRepository<T>
Migration inicial (InitialCreate) aplicada correctamente

API

Configuración de EF Core con SQLite en Program.cs
Connection string en appsettings.json

Próximos pasos

Interfaces específicas por entidad
Servicios
Controladores
Autenticación JWT
///
