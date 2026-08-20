namespace GestorDeTurnos.Application.DTOs;

public class CrearCanchaRequest
{
    public int IdComplejo { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal PrecioHora { get; set; }
    public string? UrlImagen { get; set; }
    public Dictionary<string, HorarioDia>? Horarios { get; set; }
}

public class HorarioDia
{
    public string Apertura { get; set; } = string.Empty;
    public string Cierre { get; set; } = string.Empty;
}
