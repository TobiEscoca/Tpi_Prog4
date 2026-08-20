namespace GestorDeTurnos.Domain.Entities
{
    public class Cancha
    {
        public int IdCancha { get; set; }
        public int IdComplejo { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal PrecioHora { get; set; }
        public string? UrlImagen { get; set; }
        public bool Activo { get; set; } = true;

        // Navegación
        public Complejo Complejo { get; set; } = null!;
        public ICollection<Turno> Turnos { get; set; } = new List<Turno>();
        public ICollection<TurnoPlantilla> Plantillas { get; set; } = new List<TurnoPlantilla>();
    }
}
