namespace GestorDeTurnos.Application.DTOs;

public class CrearTurnoRequest
{
    public int IdCancha { get; set; }
    public string HoraInicio { get; set; } = string.Empty;
    public string HoraFin { get; set; } = string.Empty;
}
