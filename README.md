# GestorDeTurnos

**Integrantes:** Tobías Escoca, Martín Calandra

Sistema de gestión de turnos para complejos deportivos. API REST desarrollada en .NET 10 siguiendo Clean Architecture.

---

## Arquitectura

Solución dividida en 4 proyectos:

| Proyecto | Capa | Responsabilidad |
|---|---|---|
| `GestorDeTurnos.Domain` | Domain | Entidades y enums del negocio |
| `GestorDeTurnos.Application` | Application | DTOs, interfaces, servicios y mapeos |
| `GestorDeTurnos.Infrastructure` | Infrastructure | DbContext, repositorios y migraciones EF Core |
| `GestorDeTurnos` | Web API | Controladores, auth JWT, Swagger y configuración |

### Flujo de dependencias

```
Web API → Infrastructure → Application → Domain
```

---

## Modelo de Datos

```
Usuario (1) ──< (N) Complejo       Un usuario (dueño) tiene varios complejos
Usuario (1) ──< (N) Turno          Un usuario (cliente) tiene varios turnos
Complejo (1) ──< (N) Cancha        Un complejo tiene varias canchas
Cancha (1) ──< (N) Turno           Una cancha tiene varios turnos
Turno (1) ──< (N) Notificacion     Un turno tiene varias notificaciones
```

Todas las claves foráneas usan `DeleteBehavior.Restrict`.

### Roles de Usuario

- `Cliente` — Confirma y cancela turnos
- `DuenoComplejo` — Administra sus complejos, canchas y turnos
- `AdministradorGeneral` — Control total del sistema

### Estados de Turno

- `Pendiente` → se crea sin cliente asignado
- `Confirmado` → un cliente lo confirma
- `Cancelado` → se revierte a Pendiente

---

## API Endpoints

### Autenticación (`api/Auth`) — Público
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/register` | Registro de nuevo usuario (rol Cliente) |
| POST | `/login` | Inicio de sesión, devuelve JWT |

### Usuarios (`api/Usuario`) — Solo AdministradorGeneral
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/ObtenerUsuarios` | Listar todos |
| GET | `/BuscarUsuarioPorId/{id}` | Obtener por ID |
| POST | `/Crear-usuario-admin` | Crear usuario con cualquier rol |
| PUT | `/ActualizarUsuario/{id}` | Actualizar parcialmente |
| DELETE | `/EliminarUsuario/{id}` | Eliminar |

### Complejos (`api/Complejo`) — Autenticado
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Todos | Listar todos |
| GET | `/BuscarComplejoPorId/{id}` | Admin | Detalle |
| GET | `/BuscarPorDueno/{idDueno}` | Admin | Por dueño |
| GET | `/activos` | Admin | Solo activos |
| POST | `/CrearComplejo` | Admin/Dueño | Crear |
| PUT | `/ActualizarComplejo/{id}` | Admin/Dueño | Actualizar |
| DELETE | `/EliminarComplejo/{id}` | Admin/Dueño | Eliminar |

### Canchas (`api/Cancha`) — Autenticado
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Todos | Listar todas |
| GET | `/BuscarCanchaPorId/{id}` | Todos | Detalle |
| GET | `/BuscarPorComplejo/{idComplejo}` | Todos | Por complejo |
| GET | `/BuscarActivasPorComplejo/{idComplejo}` | Todos | Activas por complejo |
| POST | `/CrearCancha` | Dueño | Crear |
| PUT | `/ActualizarCancha/{id}` | Dueño | Actualizar |
| DELETE | `/EliminarCancha/{id}` | Dueño | Eliminar |

### Turnos (`api/Turno`) — Autenticado
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Todos | Listar todos |
| GET | `/MisTurnos-Cliente` | Todos | Turnos del usuario autenticado |
| GET | `/BuscarTurnoPorId/{id}` | Todos | Detalle |
| GET | `/BuscarTurnosPorCliente/{idCliente}` | Admin/Dueño | Por cliente |
| GET | `/BuscarTurnosPorCancha/{idCancha}` | Todos | Por cancha |
| POST | `/CrearTurno` | Admin/Dueño | Crear (solo hora, fecha = hoy) |
| PUT | `/ConfirmarTurno/{id}` | Cliente | Confirmar y asignarse |
| PUT | `/CancelarTurno/{id}` | Cliente/Dueño | Cancelar (revierte a Pendiente) |
| DELETE | `/EliminarTurno/{id}` | Admin/Dueño | Eliminar |

### Notificaciones (`api/Notificacion`)
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Admin | Listar todas |
| GET | `/BuscarNotificacionPorId/{id}` | Admin | Detalle |
| GET | `/BuscarNotificacionesPorTurno/{idTurno}` | Admin | Por turno |
| POST | `/CrearNotificacion` | Admin | Crear |
| DELETE | `/EliminarNotificacion/{id}` | Admin | Eliminar |
| GET | `/MisNotificaciones-Cliente` | Cliente | Notificaciones del usuario |

### Clima (`api/Weather`) — Público
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/ObtenerClimaPorCiudad/{city}` | Clima actual vía Open-Meteo |

---

## Tecnologías

- **.NET 10** — target framework
- **Entity Framework Core 10** — ORM + SQLite
- **JWT Bearer** — autenticación (expiración configurable: 24h)
- **BCrypt.Net-Next** — hasheo de contraseñas
- **Swagger** — documentación interactiva
- **Open-Meteo API** — datos climáticos externos
- **GitHub Actions** — CI/CD a Azure Web App

---

## Configuración

### appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=GestorDeTurnos.db"
  },
  "Jwt": {
    "Key": "...",
    "Issuer": "GestorDeTurnos",
    "Audience": "GestorDeTurnosUsers",
    "ExpirationHours": 24
  },
  "OpenMeteo": {
    "BaseUrl": "https://api.open-meteo.com/v1/",
    "GeocodingUrl": "https://geocoding-api.open-meteo.com/v1/"
  }
}
```

### Ejecutar

```bash
dotnet restore
dotnet run --project GestorDeTurnos
```

Las migraciones se aplican automáticamente al iniciar.

---

## CI/CD

El workflow de GitHub Actions en `.github/workflows/deploy.yml` despliega automáticamente a Azure Web App (`gestordeturnos-api`) al hacer push a `main`.
