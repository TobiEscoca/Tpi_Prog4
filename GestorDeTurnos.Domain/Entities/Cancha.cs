using System;
using System.Collections.Generic;
using System.Text;

namespace GestorDeTurnos.Domain.Entities
{
    public class Cancha
    {
        public int IdCancha { get; set; }
        public int IdComplejo { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal PrecioHora { get; set; }
        public bool Activo { get; set; } = true;

        // Navegación
        public Complejo Complejo { get; set; } = null!;
        public ICollection<Turno> Turnos { get; set; } = new List<Turno>();
    }
}
