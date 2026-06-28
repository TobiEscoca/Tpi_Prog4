public class NotificacionResponseDTO
{
    public int IdNotificacion { get; set; }
    public int IdTurno { get; set; }
    public string Mensaje { get; set; } = string.Empty;

    public string Destinatario { get; set; } = string.Empty;
    public bool Enviado { get; set; }
    public DateTime? FechaEnvio { get; set; }
}