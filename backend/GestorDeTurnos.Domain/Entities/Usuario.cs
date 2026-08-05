using GestorDeTurnos.Domain.Enums;

namespace GestorDeTurnos.Domain.Entities
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public RolUsuario Rol { get; set; }
        public bool Activo { get; set; } = true;
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

        // Navegación
        public ICollection<Complejo> Complejos { get; set; } = new List<Complejo>();
        public ICollection<Turno> Turnos { get; set; } = new List<Turno>();
    }
}