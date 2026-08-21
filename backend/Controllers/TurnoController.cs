using System.Globalization;
using System.Security.Claims;
using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Application.Mappings;
using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TurnoController : ControllerBase
    {
        private readonly TurnoService _turnoService;
        private readonly EliminacionEnCascadaService _eliminacionService;
        private readonly CanchaService _canchaService;
        private readonly ComplejoService _complejoService;

        public TurnoController(
            TurnoService turnoService,
            EliminacionEnCascadaService eliminacionService,
            CanchaService canchaService,
            ComplejoService complejoService)
        {
            _turnoService = turnoService;
            _eliminacionService = eliminacionService;
            _canchaService = canchaService;
            _complejoService = complejoService;
        }

        private async Task<IActionResult> EjecutarSeguro(Func<Task<IActionResult>> accion)
        {
            try
            {
                return await accion();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var turnos = await _turnoService.GetAllAsync();
            return Ok(turnos.Select(t => t.ToDto()));
        }

        [HttpGet("MisTurnos-Cliente")]
        public async Task<IActionResult> GetMisTurnos()
        {
            var idCliente = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var turnos = await _turnoService.GetByClienteAsync(idCliente);
            return Ok(turnos.Select(t => t.ToDto()));
        }


        [HttpGet("BuscarTurnoPorId/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var turno = await _turnoService.GetByIdAsync(id);
            if (turno == null) return NotFound();
            return Ok(turno.ToDto());
        }

        [HttpGet("BuscarTurnosPorCliente/{idCliente}")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> GetByCliente(int idCliente)
        {
            var turnos = await _turnoService.GetByClienteAsync(idCliente);
            return Ok(turnos.Select(t => t.ToDto()));
        }

        [HttpGet("BuscarTurnosPorCancha/{idCancha}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByCancha(int idCancha, [FromQuery] string? fecha)
        {
            if (!string.IsNullOrWhiteSpace(fecha))
            {
                if (!DateTime.TryParseExact(fecha.Trim(), "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var fechaParseada))
                    return BadRequest("El formato de la fecha debe ser yyyy-MM-dd.");

                var turnos = await _turnoService.GetByCanchaYFechaAsync(idCancha, fechaParseada);
                return Ok(turnos.Select(t => t.ToDto()));
            }

            var todos = await _turnoService.GetByCanchaAsync(idCancha);
            return Ok(todos.Select(t => t.ToDto()));
        }

        [HttpPost("CrearTurno")]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Add([FromBody] CrearTurnoRequest request)
        {
            if (request.IdCancha <= 0)
                return BadRequest("El id de la cancha es obligatorio.");

            if (string.IsNullOrWhiteSpace(request.HoraInicio))
                return BadRequest("El horario de inicio es obligatorio.");

            if (string.IsNullOrWhiteSpace(request.HoraFin))
                return BadRequest("El horario de fin es obligatorio.");

            if (!TimeSpan.TryParseExact(request.HoraInicio.Trim(), "hh\\:mm", CultureInfo.InvariantCulture, out var horaInicio))
                return BadRequest("El horario de inicio debe tener el formato 00:00.");

            if (!TimeSpan.TryParseExact(request.HoraFin.Trim(), "hh\\:mm", CultureInfo.InvariantCulture, out var horaFin))
                return BadRequest("El horario de fin debe tener el formato 00:00.");

            if (horaInicio < TimeSpan.FromHours(9))
                return BadRequest("El horario de inicio no puede ser anterior a las 09:00.");

            if (horaFin > TimeSpan.FromHours(23))
                return BadRequest("El horario de fin no puede ser posterior a las 23:00.");

            if (horaFin - horaInicio > TimeSpan.FromHours(1))
                return BadRequest("El turno no puede durar más de 1 hora.");

            DateTime fechaSeleccionada;
            if (string.IsNullOrWhiteSpace(request.Fecha))
            {
                fechaSeleccionada = DateTime.Today;
            }
            else if (!DateTime.TryParseExact(request.Fecha.Trim(), "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out fechaSeleccionada))
            {
                return BadRequest("El formato de la fecha debe ser yyyy-MM-dd.");
            }

            if (fechaSeleccionada.Date < DateTime.Today)
                return BadRequest("No se pueden crear turnos para una fecha anterior a hoy.");

            if (fechaSeleccionada.Date > DateTime.Today.AddDays(30))
                return BadRequest("No se pueden crear turnos con más de 30 días de anticipación.");

            var cancha = await _canchaService.GetByIdAsync(request.IdCancha);
            if (cancha == null)
                return NotFound("No existe la cancha indicada.");

            if (!User.IsInRole("AdministradorGeneral"))
            {
                var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var complejo = await _complejoService.GetByIdAsync(cancha.IdComplejo);
                if (complejo == null || complejo.IdDueno != idUsuario)
                    return Forbid("Solo puedes crear turnos en canchas de tus complejos.");
            }

            var turno = new Turno
            {
                IdCancha = request.IdCancha,
                FechaHoraInicio = fechaSeleccionada.Date.Add(horaInicio),
                FechaHoraFin = fechaSeleccionada.Date.Add(horaFin),
                Estado = GestorDeTurnos.Domain.Enums.EstadoTurno.Pendiente,
                IdCliente = null
            };

            return await EjecutarSeguro(async () =>
            {
                await _turnoService.AddAsync(turno);
                return CreatedAtAction(nameof(GetById), new { id = turno.IdTurno }, "Turno creado correctamente.");
            });
        }

        [HttpDelete("EliminarTurno/{id}")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> Delete(int id)
        {
            await _eliminacionService.EliminarTurnoAsync(id);
            return Ok("Turno eliminado correctamente.");
        }

        [HttpPut("ConfirmarTurno/{id}")]
        [Authorize (Roles = "Cliente")]
        public async Task<IActionResult> Confirmar(int id)
        {
            var idCliente = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            return await EjecutarSeguro(async () =>
            {
                await _turnoService.ConfirmarAsync(id, idCliente);
                return Ok("Turno confirmado correctamente.");
            });
        }

        [HttpPut("CancelarTurno/{id}")]
        [Authorize(Roles = "Cliente, DuenoComplejo, AdministradorGeneral")]
        public async Task<IActionResult> Cancelar(int id)
        {
            return await EjecutarSeguro(async () =>
            {
                await _turnoService.CancelarAsync(id);
                return Ok("Turno cancelado correctamente.");
            });
        }


    }
}
