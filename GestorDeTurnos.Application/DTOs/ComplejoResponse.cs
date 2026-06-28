public class ComplejoResponseDTO
{
    public int IdComplejo { get; set; }
    public int IdDueno { get; set; }
    public string NombreDueno { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Email { get; set; }
    public bool Activo { get; set; }
    public List<CanchaResumenDTO> Canchas { get; set; } = new();
}