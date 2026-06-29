using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Mappings
{
    public static class EntityMappings
    {
        public static UsuarioResponseDTO ToDto(this Usuario u) => new()
        {
            IdUsuario = u.IdUsuario,
            Nombre = u.Nombre,
            Email = u.Email,
            Rol = u.Rol.ToString(),
            Activo = u.Activo,
            FechaRegistro = u.FechaRegistro,
            Complejos = u.Complejos?.Select(c => c.ToDto()).ToList() ?? []
        };

        public static ComplejoResponseDTO ToDto(this Complejo c) => new()
        {
            IdComplejo = c.IdComplejo,
            IdDueno = c.IdDueno,
            NombreDueno = c.Dueno?.Nombre ?? string.Empty,
            Nombre = c.Nombre,
            Direccion = c.Direccion,
            Telefono = c.Telefono,
            Email = c.Email,
            Activo = c.Activo,
            Canchas = c.Canchas?.Select(ca => ca.ToResumen()).ToList() ?? []
        };

        public static ComplejoResumenDTO ToResumen(this Complejo c) => new()
        {
            IdComplejo = c.IdComplejo,
            IdDueno = c.IdDueno,
            Nombre = c.Nombre,
            Direccion = c.Direccion,
            Telefono = c.Telefono,
            Email = c.Email,
            Activo = c.Activo
        };

        public static CanchaResponseDTO ToDto(this Cancha c) => new()
        {
            IdCancha = c.IdCancha,
            IdComplejo = c.IdComplejo,
            NombreComplejo = c.Complejo?.Nombre ?? string.Empty,
            Nombre = c.Nombre,
            PrecioHora = c.PrecioHora,
            Activo = c.Activo,
            Turnos = c.Turnos?.Select(t => t.ToDto()).ToList() ?? []
        };

        public static CanchaResumenDTO ToResumen(this Cancha c) => new()
        {
            IdCancha = c.IdCancha,
            IdComplejo = c.IdComplejo,
            Nombre = c.Nombre,
            PrecioHora = c.PrecioHora,
            Activo = c.Activo
        };

        public static TurnoResponseDTO ToDto(this Turno t) => new()
        {
            IdTurno = t.IdTurno,
            IdCancha = t.IdCancha,
            NombreCancha = t.Cancha?.Nombre ?? string.Empty,
            IdCliente = t.IdCliente,
            FechaHoraInicio = t.FechaHoraInicio,
            FechaHoraFin = t.FechaHoraFin,
            Estado = t.Estado.ToString(),
            FechaCreacion = t.FechaCreacion
        };

        public static NotificacionResponseDTO ToDto(this Notificacion n) => new()
        {
            IdNotificacion = n.IdNotificacion,
            IdTurno = n.IdTurno,
            Mensaje = n.Mensaje,
            Destinatario = n.Destinatario,
            FechaEnvio = n.FechaEnvio,
            Enviado = n.Enviado
        };
    }
}
