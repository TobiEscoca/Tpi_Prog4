namespace GestorDeTurnos.Application.DTOs
{
    public class CanchaResumenDTO
{
    public int IdCancha { get; set; }
    public int IdComplejo { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal PrecioHora { get; set; }
    public bool Activo { get; set; }
    }
}