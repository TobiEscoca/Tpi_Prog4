namespace GestorDeTurnos.Application.DTOs;

public class RegisterAdminRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string AdminSecretKey { get; set; } = string.Empty;
}
