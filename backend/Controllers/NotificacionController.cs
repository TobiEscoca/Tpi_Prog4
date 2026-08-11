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
    public class NotificacionController : ControllerBase
    {
        private readonly NotificacionService _notificacionService;
        private readonly TurnoService _turnoService;

        public NotificacionController(NotificacionService notificacionService, TurnoService turnoService)
        {
            _notificacionService = notificacionService;
            _turnoService = turnoService;
        }

        [HttpGet]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> GetAll()
        {
            var notificaciones = await _notificacionService.GetAllAsync();
            return Ok(notificaciones.Select(n => n.ToDto()));
        }

        [HttpGet("BuscarNotificacionPorId/{id}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> GetById(int id)
        {
            var notificacion = await _notificacionService.GetByIdAsync(id);
            if (notificacion == null) return NotFound();
            return Ok(notificacion.ToDto());
        }

        [HttpGet("BuscarNotificacionesPorTurno/{idTurno}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> GetByTurno(int idTurno)
        {
            var notificaciones = await _notificacionService.GetByTurnoAsync(idTurno);
            return Ok(notificaciones.Select(n => n.ToDto()));
        }

        [HttpPost("CrearNotificacion")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Add([FromBody] CrearNotificacionRequest request)
        {
            if (request.IdTurno <= 0)
                return BadRequest("El id del turno es obligatorio.");

            if (string.IsNullOrWhiteSpace(request.Mensaje))
                return BadRequest("El mensaje es obligatorio.");

            if (string.IsNullOrWhiteSpace(request.Destinatario))
                return BadRequest("El destinatario es obligatorio.");

            var turno = await _turnoService.GetByIdAsync(request.IdTurno);
            if (turno == null)
                return NotFound("No existe el turno indicado.");

            var notificacion = new Notificacion
            {
                IdTurno = request.IdTurno,
                Mensaje = request.Mensaje.Trim(),
                Destinatario = request.Destinatario.Trim(),
                Enviado = request.Enviado,
                FechaEnvio = request.Enviado ? (request.FechaEnvio ?? DateTime.Now) : null,
                Turno = turno
            };

            await _notificacionService.AddAsync(notificacion);
            return CreatedAtAction(nameof(GetById), new { id = notificacion.IdNotificacion }, notificacion.ToDto());
        }

        [HttpDelete("EliminarNotificacion/{id}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Delete(int id)
        {
            await _notificacionService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("MisNotificaciones-Cliente")]
        [Authorize(Roles = "Cliente")]
        public async Task<IActionResult> GetMisNotificaciones()
        {
            var idCliente = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var emailCliente = User.FindFirstValue(ClaimTypes.Email)!;
            var notificaciones = await _notificacionService.GetByClienteAsync(idCliente, emailCliente);
            return Ok(notificaciones.Select(n => n.ToDto()));
        }
    }
}