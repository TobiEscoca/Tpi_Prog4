namespace GestorDeTurnos.Application.DTOs
{
    public class ActualizarCanchaRequest
    {
        public string? Nombre { get; set; }
        public decimal? PrecioHora { get; set; }
        public bool? Activo { get; set; }
    }
}
