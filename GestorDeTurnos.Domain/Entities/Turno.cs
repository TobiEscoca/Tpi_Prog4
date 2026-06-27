using System;
using System.Collections.Generic;
using System.Text;

using GestorDeTurnos.Domain.Enums;

namespace GestorDeTurnos.Domain.Entities
{
    public class Turno
    {
        public int IdTurno { get; set; }
        public int? IdCliente { get; set; }
        public int IdCancha { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFin { get; set; }
        public EstadoTurno Estado { get; set; } = EstadoTurno.Pendiente;
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        // Navegación
        public Usuario? Cliente { get; set; }
        public Cancha Cancha { get; set; } = null!;
        public ICollection<Notificacion> Notificaciones { get; set; } = new List<Notificacion>();
    }
}
