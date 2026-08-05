namespace GestorDeTurnos.Application.DTOs
{
    public class UsuarioResponseDTO
{
    public int IdUsuario { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;

    public bool Activo { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public List<ComplejoResponseDTO> Complejos { get; set; } = new();
    }
}