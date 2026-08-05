namespace GestorDeTurnos.Application.DTOs
{
    public class ComplejoResumenDTO
{
    public int IdComplejo { get; set; }
    public int IdDueno { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public bool Activo { get; set; }
    }
}