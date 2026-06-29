namespace GestorDeTurnos.Application.DTOs
{
    public class CanchaResponseDTO
{
    public int IdCancha { get; set; }
    public int IdComplejo { get; set; }
    public string NombreComplejo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public decimal PrecioHora { get; set; }
    public bool Activo { get; set; }
    public List<TurnoResponseDTO> Turnos { get; set; } = new();
    }
}