namespace GestorDeTurnos.Domain.Entities
{
    public class TurnoPlantilla
    {
        public int IdPlantilla { get; set; }
        public int IdCancha { get; set; }
        public int DiaSemana { get; set; }
        public TimeSpan HoraInicio { get; set; }
        public TimeSpan HoraFin { get; set; }
        public bool Activo { get; set; } = true;

        public Cancha Cancha { get; set; } = null!;
    }
}
