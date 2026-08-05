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
    [Authorize(Roles = "AdministradorGeneral")]
    public class NotificacionController : ControllerBase
    {
        private readonly NotificacionService _notificacionService;

        public NotificacionController(NotificacionService notificacionService)
        {
            _notificacionService = notificacionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notificaciones = await _notificacionService.GetAllAsync();
            return Ok(notificaciones.Select(n => n.ToDto()));
        }

        [HttpGet("BuscarNotificacionPorId/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var notificacion = await _notificacionService.GetByIdAsync(id);
            if (notificacion == null) return NotFound();
            return Ok(notificacion.ToDto());
        }

        [HttpGet("BuscarNotificacionesPorTurno/{idTurno}")]
        public async Task<IActionResult> GetByTurno(int idTurno)
        {
            var notificaciones = await _notificacionService.GetByTurnoAsync(idTurno);
            return Ok(notificaciones.Select(n => n.ToDto()));
        }

        [HttpPost("CrearNotificacion")]
        public async Task<IActionResult> Add([FromBody] Notificacion notificacion)
        {
            await _notificacionService.AddAsync(notificacion);
            return CreatedAtAction(nameof(GetById), new { id = notificacion.IdNotificacion }, notificacion);
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
            var notificaciones = await _notificacionService.GetByClienteAsync(idCliente);
            return Ok(notificaciones.Select(n => n.ToDto()));
        }
    }
}