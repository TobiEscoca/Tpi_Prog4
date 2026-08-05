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
                using (var scope = _serviceProvider.CreateScope())
                {
                    var turnoRepository = scope.ServiceProvider.GetRequiredService<ITurnoRepository>();
                    var canchaRepository = scope.ServiceProvider.GetRequiredService<ICanchaRepository>();

                    // 1. Expirar turnos Pendiente cuya hora ya pasó
                    var vencidos = await turnoRepository.GetPendientesVencidosAsync();
                    foreach (var turno in vencidos)
                    {
                        turno.Estado = EstadoTurno.Expirado;
                        await turnoRepository.UpdateAsync(turno);
                    }

                    // 2. Renovar turnos de días anteriores (Expirado o Confirmado) para hoy
                    var renovables = await turnoRepository.GetRenovablesDeDiasAnterioresAsync();
                    foreach (var turno in renovables)
                    {
                        var existe = await turnoRepository.ExisteTurnoParaHoyAsync(
                            turno.IdCancha,
                            turno.FechaHoraInicio.TimeOfDay,
                            turno.FechaHoraFin.TimeOfDay);

                        if (existe)
                            continue;

                        var cancha = await canchaRepository.GetByIdAsync(turno.IdCancha);
                        if (cancha == null || !cancha.Activo)
                            continue;

                        var duracion = turno.FechaHoraFin - turno.FechaHoraInicio;

                        var nuevo = new Turno
                        {
                            IdCancha = turno.IdCancha,
                            FechaHoraInicio = DateTime.Today.Add(turno.FechaHoraInicio.TimeOfDay),
                            FechaHoraFin = DateTime.Today.Add(turno.FechaHoraInicio.TimeOfDay).Add(duracion),
                            Estado = EstadoTurno.Pendiente,
                            IdCliente = null
                        };

                        await turnoRepository.AddAsync(nuevo);
                    }
                }

                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
