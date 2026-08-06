namespace GestorDeTurnos.Application.DTOs
{
    public class CrearNotificacionRequest
    {
        public int IdTurno { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public string Destinatario { get; set; } = string.Empty;
        public bool Enviado { get; set; } = false;
        public DateTime? FechaEnvio { get; set; }
    }
}
