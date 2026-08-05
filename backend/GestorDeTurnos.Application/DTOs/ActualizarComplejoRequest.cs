using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.DTOs
{
    public class ActualizarComplejoRequest
    {
        public string? Nombre { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
        public bool? Activo { get; set; }

        public bool HasChanges => Nombre != null || Direccion != null || Telefono != null || Email != null || Activo.HasValue;

        public List<string> ApplyTo(Complejo complejo)
        {
            var errors = new List<string>();

            if (Nombre != null)
            {
                if (string.IsNullOrWhiteSpace(Nombre))
                    errors.Add("El nombre no puede estar vacío.");
                else
                    complejo.Nombre = Nombre.Trim();
            }

            if (Direccion != null)
            {
                if (string.IsNullOrWhiteSpace(Direccion))
                    errors.Add("La dirección no puede estar vacía.");
                else
                    complejo.Direccion = Direccion.Trim();
            }

            if (Telefono != null)
                complejo.Telefono = string.IsNullOrWhiteSpace(Telefono) ? null : Telefono.Trim();

            if (Email != null)
            {
                if (string.IsNullOrWhiteSpace(Email))
                    errors.Add("El email no puede estar vacío.");
                else
                    complejo.Email = Email.Trim();
            }

            if (Activo.HasValue)
                complejo.Activo = Activo.Value;

            return errors;
        }
    }
}
