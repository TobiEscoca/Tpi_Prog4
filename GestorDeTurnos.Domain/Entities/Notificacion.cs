using System;
using System.Collections.Generic;
using System.Text;

namespace GestorDeTurnos.Domain.Entities
{
    public class Notificacion
    {
        public int IdNotificacion { get; set; }
        public int IdTurno { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public string Destinatario { get; set; } = string.Empty;
        public DateTime? FechaEnvio { get; set; }
        public bool Enviado { get; set; } = false;

        // Navegación
        public Turno Turno { get; set; } = null!;
    }
}