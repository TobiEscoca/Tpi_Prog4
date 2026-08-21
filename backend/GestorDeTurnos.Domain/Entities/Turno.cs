using GestorDeTurnos.Domain.Enums;

namespace GestorDeTurnos.Domain.Entities
{
    public class Turno
    {
        public int IdTurno { get; set; }
        public int? IdCliente { get; set; }
        public int IdCancha { get; set; }
        public int? IdPlantilla { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public EstadoTurno Estado { get; set; } = EstadoTurno.Pendiente;
        public DateTime FechaCreacion { get; set; } = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

        // Navegación
        public Usuario? Cliente { get; set; }
        public Cancha Cancha { get; set; } = null!;
        public TurnoPlantilla? Plantilla { get; set; }
        public ICollection<Notificacion> Notificaciones { get; set; } = new List<Notificacion>();
    }
}
