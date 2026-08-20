namespace GestorDeTurnos.Application.DTOs
{
    public class TurnoPlantillaDTO
    {
        public int IdPlantilla { get; set; }
        public int IdCancha { get; set; }
        public int DiaSemana { get; set; }
        public string HoraInicio { get; set; } = string.Empty;
        public string HoraFin { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class TogglePlantillaRequest
    {
        public int IdPlantilla { get; set; }
        public bool Activo { get; set; }
    }

    public class BulkToggleRequest
    {
        public List<TogglePlantillaRequest> Plantillas { get; set; } = new();
    }
}
