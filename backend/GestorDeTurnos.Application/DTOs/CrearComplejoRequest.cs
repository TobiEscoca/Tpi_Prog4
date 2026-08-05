namespace GestorDeTurnos.Application.DTOs;

public class CrearComplejoRequest
{
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string? Telefono { get; set; }
}
