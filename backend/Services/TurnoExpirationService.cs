using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace GestorDeTurnos.Services
{
    public class TurnoExpirationService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public TurnoExpirationService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcesarCicloAsync(stoppingToken);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    Console.WriteLine($"[TurnoExpirationService] Error: {ex.Message}");
                }

                try
                {
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
            }
        }

        private async Task ProcesarCicloAsync(CancellationToken stoppingToken)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var turnoRepository = scope.ServiceProvider.GetRequiredService<ITurnoRepository>();
                var canchaRepository = scope.ServiceProvider.GetRequiredService<ICanchaRepository>();
                var plantillaRepository = scope.ServiceProvider.GetRequiredService<ITurnoPlantillaRepository>();

                // 1. Expirar turnos Pendientes cuya hora ya pasó
                var vencidos = await turnoRepository.GetPendientesVencidosAsync();
                foreach (var turno in vencidos)
                {
                    turno.Estado = EstadoTurno.Expirado;
                    await turnoRepository.UpdateAsync(turno);
                }

                // 2. Generar turnos desde plantillas para los próximos 7 días
                var canchas = await canchaRepository.GetAllAsync();
                var hoy = DateTime.Today;

                foreach (var cancha in canchas)
                {
                    if (!cancha.Activo) continue;

                    var plantillas = await plantillaRepository.GetActivasPorCanchaAsync(cancha.IdCancha);

                    for (int d = 0; d < 7; d++)
                    {
                        var fecha = hoy.AddDays(d);
                        var diaSemana = (int)fecha.DayOfWeek;

                        var plantillasDelDia = plantillas.Where(p => p.DiaSemana == diaSemana);

                        foreach (var plantilla in plantillasDelDia)
                        {
                            var fechaInicio = fecha.Date + plantilla.HoraInicio;
                            var fechaFin = fecha.Date + plantilla.HoraFin;

                            var existe = await turnoRepository.ExisteSolapamientoAsync(
                                cancha.IdCancha, fechaInicio, fechaFin);

                            if (!existe)
                            {
                                var nuevo = new Turno
                                {
                                    IdCancha = cancha.IdCancha,
                                    IdPlantilla = plantilla.IdPlantilla,
                                    FechaHoraInicio = fechaInicio,
                                    FechaHoraFin = fechaFin,
                                    Estado = fechaInicio <= DateTime.Now
                                        ? EstadoTurno.Expirado
                                        : EstadoTurno.Pendiente,
                                    IdCliente = null
                                };
                                await turnoRepository.AddAsync(nuevo);
                            }
                        }
                    }
                }

                // 3. Cancelar turnos Confirmados cuya plantilla fue desactivada
                var todosLosTurnos = await turnoRepository.GetAllAsync();
                var turnosConfirmados = todosLosTurnos
                    .Where(t => t.Estado == EstadoTurno.Confirmado && t.FechaHoraInicio.Date >= hoy);

                foreach (var turno in turnosConfirmados)
                {
                    if (turno.IdPlantilla.HasValue)
                    {
                        var plantilla = await plantillaRepository.GetByIdAsync(turno.IdPlantilla.Value);
                        if (plantilla != null && !plantilla.Activo)
                        {
                            turno.Estado = EstadoTurno.Cancelado;
                            turno.IdCliente = null;
                            await turnoRepository.UpdateAsync(turno);
                        }
                    }
                }
            }
        }
    }
}
