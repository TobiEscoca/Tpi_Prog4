using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            return Ok(notificaciones);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var notificacion = await _notificacionService.GetByIdAsync(id);
            if (notificacion == null) return NotFound();
            return Ok(notificacion);
        }

        [HttpGet("turno/{idTurno}")]
        public async Task<IActionResult> GetByTurno(int idTurno)
        {
            var notificaciones = await _notificacionService.GetByTurnoAsync(idTurno);
            return Ok(notificaciones);
        }

        [HttpPost]
        public async Task<IActionResult> Add(Notificacion notificacion)
        {
            await _notificacionService.AddAsync(notificacion);
            return CreatedAtAction(nameof(GetById), new { id = notificacion.IdNotificacion }, notificacion);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _notificacionService.DeleteAsync(id);
            return NoContent();
        }
    }
}