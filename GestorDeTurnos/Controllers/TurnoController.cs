using System.Globalization;
using System.Security.Claims;
using GestorDeTurnos.Application.DTOs;
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

        public TurnoController(TurnoService turnoService)
        {
            _turnoService = turnoService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var turnos = await _turnoService.GetAllAsync();
            return Ok(turnos);
        }

        [HttpGet("MisTurnos-Cliente")]
        [Authorize(Roles = "Cliente")]
        public async Task<IActionResult> GetMisTurnos()
        {
            var idCliente = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var turnos = await _turnoService.GetByClienteAsync(idCliente);
            return Ok(turnos);
        }


        [HttpGet("BuscarTurnoPorId/{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var turno = await _turnoService.GetByIdAsync(id);
            if (turno == null) return NotFound();
            return Ok(turno);
        }

        [HttpGet("BuscarTurnosPorCliente/{idCliente}")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> GetByCliente(int idCliente)
        {
            var turnos = await _turnoService.GetByClienteAsync(idCliente);
            return Ok(turnos);
        }

        [HttpGet("BuscarTurnosPorCancha/{idCancha}")]
        public async Task<IActionResult> GetByCancha(int idCancha)
        {
            var turnos = await _turnoService.GetByCanchaAsync(idCancha);
            return Ok(turnos);
        }

        [HttpPost("CrearTurno")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> Add(CrearTurnoRequest request)
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

            var turno = new Turno
            {
                IdCancha = request.IdCancha,
                FechaHoraInicio = DateTime.Today.Add(horaInicio),
                FechaHoraFin = DateTime.Today.Add(horaFin),
                Estado = GestorDeTurnos.Domain.Enums.EstadoTurno.Pendiente,
                IdCliente = null
            };

            try
            {
                await _turnoService.AddAsync(turno);
                return CreatedAtAction(nameof(GetById), new { id = turno.IdTurno }, turno);
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

        [HttpDelete("EliminarTurno/{id}")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> Delete(int id)
        {
            await _turnoService.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("ConfirmarTurno/{id}")]
        [Authorize (Roles = "Cliente")]
        public async Task<IActionResult> Confirmar(int id)
        {
            var idCliente = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            try
            {
                await _turnoService.ConfirmarAsync(id, idCliente);
                return NoContent();
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

        [HttpPut("CancelarTurno/{id}")]
        [Authorize(Roles = "Cliente, DuenoComplejo")]
        public async Task<IActionResult> Cancelar(int id)
        {
            try
            {
                await _turnoService.CancelarAsync(id);
                return NoContent();
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


    }
}
