using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.DTOs
{
    public class ActualizarCanchaRequest
    {
        public string? Nombre { get; set; }
        public decimal? PrecioHora { get; set; }
        public bool? Activo { get; set; }

        public bool HasChanges => Nombre != null || PrecioHora.HasValue || Activo.HasValue;

        public List<string> ApplyTo(Cancha cancha)
        {
            var errors = new List<string>();

            if (Nombre != null)
            {
                if (string.IsNullOrWhiteSpace(Nombre))
                    errors.Add("El nombre no puede estar vacío.");
                else
                    cancha.Nombre = Nombre.Trim();
            }

            if (PrecioHora.HasValue)
            {
                if (PrecioHora <= 0)
                    errors.Add("El precio por hora debe ser mayor a cero.");
                else
                    cancha.PrecioHora = PrecioHora.Value;
            }

            if (Activo.HasValue)
                cancha.Activo = Activo.Value;

            return errors;
        }
    }
}
