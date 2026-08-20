using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Domain.Enums;

namespace GestorDeTurnos.Application.Services
{
    public class TurnoPlantillaService
    {
        private readonly ITurnoPlantillaRepository _plantillaRepository;
        private readonly ITurnoRepository _turnoRepository;

        public TurnoPlantillaService(
            ITurnoPlantillaRepository plantillaRepository,
            ITurnoRepository turnoRepository)
        {
            _plantillaRepository = plantillaRepository;
            _turnoRepository = turnoRepository;
        }

        public async Task<IEnumerable<TurnoPlantilla>> GetByCanchaAsync(int idCancha) =>
            await _plantillaRepository.GetByCanchaAsync(idCancha);

        public async Task<IEnumerable<TurnoPlantilla>> GetByCanchaYDiaAsync(int idCancha, int diaSemana) =>
            await _plantillaRepository.GetByCanchaYDiaAsync(idCancha, diaSemana);

        public async Task<TurnoPlantilla?> GetByIdAsync(int id) =>
            await _plantillaRepository.GetByIdAsync(id);

        public async Task CrearPlantillasInicialesAsync(int idCancha, Dictionary<int, (string apertura, string cierre)> horarios)
        {
            foreach (var kvp in horarios)
            {
                var dia = kvp.Key;
                var apertura = TimeSpan.Parse(kvp.Value.apertura);
                var cierre = TimeSpan.Parse(kvp.Value.cierre);

                if (cierre <= apertura)
                {
                    for (var h = apertura; h < TimeSpan.FromHours(24); h += TimeSpan.FromHours(1))
                    {
                        var plantilla = new TurnoPlantilla
                        {
                            IdCancha = idCancha,
                            DiaSemana = dia,
                            HoraInicio = h,
                            HoraFin = h + TimeSpan.FromHours(1),
                            Activo = true
                        };
                        await _plantillaRepository.AddAsync(plantilla);
                    }

                    for (var h = TimeSpan.Zero; h < cierre; h += TimeSpan.FromHours(1))
                    {
                        var plantilla = new TurnoPlantilla
                        {
                            IdCancha = idCancha,
                            DiaSemana = dia,
                            HoraInicio = h,
                            HoraFin = h + TimeSpan.FromHours(1),
                            Activo = true
                        };
                        await _plantillaRepository.AddAsync(plantilla);
                    }
                }
                else
                {
                    for (var h = apertura; h < cierre; h += TimeSpan.FromHours(1))
                    {
                        var plantilla = new TurnoPlantilla
                        {
                            IdCancha = idCancha,
                            DiaSemana = dia,
                            HoraInicio = h,
                            HoraFin = h + TimeSpan.FromHours(1),
                            Activo = true
                        };
                        await _plantillaRepository.AddAsync(plantilla);
                    }
                }
            }
        }

        public async Task TogglePlantillaAsync(int idPlantilla, bool activo)
        {
            var plantilla = await _plantillaRepository.GetByIdAsync(idPlantilla);
            if (plantilla == null)
                throw new KeyNotFoundException("Plantilla no encontrada.");

            plantilla.Activo = activo;
            await _plantillaRepository.UpdateAsync(plantilla);

            if (!activo)
            {
                var hoy = DateTime.Today;
                for (int d = 0; d <= 7; d++)
                {
                    var fecha = hoy.AddDays(d);
                    if ((int)fecha.DayOfWeek == plantilla.DiaSemana)
                    {
                        var turnos = await _turnoRepository.GetByCanchaYFechaAsync(plantilla.IdCancha, fecha);
                        foreach (var turno in turnos)
                        {
                            if (turno.Estado == EstadoTurno.Confirmado &&
                                turno.FechaHoraInicio.TimeOfDay == plantilla.HoraInicio &&
                                turno.FechaHoraFin.TimeOfDay == plantilla.HoraFin)
                            {
                                turno.Estado = EstadoTurno.Cancelado;
                                turno.IdCliente = null;
                                await _turnoRepository.UpdateAsync(turno);
                            }
                        }
                    }
                }
            }
        }

        public async Task BulkToggleAsync(List<TogglePlantillaRequest> toggles)
        {
            foreach (var toggle in toggles)
            {
                await TogglePlantillaAsync(toggle.IdPlantilla, toggle.Activo);
            }
        }
    }
}
