using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Domain.Enums;

namespace GestorDeTurnos.Application.DTOs
{
    public class ActualizarUsuarioRequest
    {
        public string? Nombre { get; set; }
        public string? Email { get; set; }
        public bool? Activo { get; set; }
        public RolUsuario? RolUsuario { get; set; }

        public bool HasChanges => Nombre != null || Email != null || Activo.HasValue || RolUsuario.HasValue;

        public List<string> ApplyTo(Usuario usuario)
        {
            var errors = new List<string>();

            if (Nombre != null)
            {
                if (string.IsNullOrWhiteSpace(Nombre))
                    errors.Add("El nombre no puede estar vacío.");
                else
                    usuario.Nombre = Nombre.Trim();
            }

            if (Email != null)
            {
                if (string.IsNullOrWhiteSpace(Email))
                    errors.Add("El email no puede estar vacío.");
                else
                    usuario.Email = Email.Trim();
            }

            if (Activo.HasValue)
                usuario.Activo = Activo.Value;

            if (RolUsuario.HasValue)
                usuario.Rol = RolUsuario.Value;

            return errors;
        }
    }
}
