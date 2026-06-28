public class TurnoResponseDTO
{
    public int IdTurno { get; set; }
    public int IdCancha { get; set; }
    public string NombreCancha { get; set; } = string.Empty;
    public int? IdCliente { get; set; }
    public DateTime FechaHoraInicio { get; set; }
    public DateTime FechaHoraFin { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; }
}