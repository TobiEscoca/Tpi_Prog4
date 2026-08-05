namespace GestorDeTurnos.Domain.Entities
{
    public class Complejo
    {
        public int IdComplejo { get; set; }
        public int IdDueno { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public bool Activo { get; set; } = true;

        // Navegación
        public Usuario Dueno { get; set; } = null!;
        public ICollection<Cancha> Canchas { get; set; } = new List<Cancha>();
    }
}
