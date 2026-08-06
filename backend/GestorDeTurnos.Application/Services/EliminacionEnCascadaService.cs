namespace GestorDeTurnos.Application.Services
{
    public class EliminacionEnCascadaService
    {
        private readonly UsuarioService _usuarioService;
        private readonly ComplejoService _complejoService;
        private readonly CanchaService _canchaService;
        private readonly TurnoService _turnoService;
        private readonly NotificacionService _notificacionService;

        public EliminacionEnCascadaService(
            UsuarioService usuarioService,
            ComplejoService complejoService,
            CanchaService canchaService,
            TurnoService turnoService,
            NotificacionService notificacionService)
        {
            _usuarioService = usuarioService;
            _complejoService = complejoService;
            _canchaService = canchaService;
            _turnoService = turnoService;
            _notificacionService = notificacionService;
        }

        public async Task EliminarTurnoAsync(int id)
        {
            var notificaciones = await _notificacionService.GetByTurnoAsync(id);
            foreach (var notificacion in notificaciones)
                await _notificacionService.DeleteAsync(notificacion.IdNotificacion);

            await _turnoService.DeleteAsync(id);
        }

        public async Task EliminarCanchaAsync(int id)
        {
            var turnos = await _turnoService.GetByCanchaAsync(id);
            foreach (var turno in turnos)
                await EliminarTurnoAsync(turno.IdTurno);

            await _canchaService.DeleteAsync(id);
        }

        public async Task EliminarComplejoAsync(int id)
        {
            var canchas = await _canchaService.GetByComplejoAsync(id);
            foreach (var cancha in canchas)
                await EliminarCanchaAsync(cancha.IdCancha);

            await _complejoService.DeleteAsync(id);
        }

        public async Task EliminarUsuarioAsync(int id)
        {
            var complejos = await _complejoService.GetByDuenoAsync(id);
            foreach (var complejo in complejos)
                await EliminarComplejoAsync(complejo.IdComplejo);

            var turnos = await _turnoService.GetByClienteAsync(id);
            foreach (var turno in turnos)
                await EliminarTurnoAsync(turno.IdTurno);

            await _usuarioService.DeleteAsync(id);
        }
    }
}
