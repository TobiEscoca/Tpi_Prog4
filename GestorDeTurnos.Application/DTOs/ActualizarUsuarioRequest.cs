namespace GestorDeTurnos.Application.DTOs
{
    public class ActualizarUsuarioRequest
    {
        public string? Nombre { get; set; }
        public string? Email { get; set; }
        public bool? Activo { get; set; }
        public GestorDeTurnos.Domain.Enums.RolUsuario? RolUsuario { get; set; }
    }
}
