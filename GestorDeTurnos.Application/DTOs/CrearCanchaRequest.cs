namespace GestorDeTurnos.Application.DTOs;

public class CrearCanchaRequest
{
    public int IdComplejo { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal PrecioHora { get; set; }
}
