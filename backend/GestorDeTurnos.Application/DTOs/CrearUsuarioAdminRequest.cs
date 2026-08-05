using GestorDeTurnos.Domain.Enums;

namespace GestorDeTurnos.Application.DTOs
{
    public class CrearUsuarioAdminRequest
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public RolUsuario RolUsuario { get; set; }
    }
}
