using System.Security.Claims;
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
            return Ok(notificaciones.Select(n => new NotificacionResponseDTO
            {
                IdNotificacion = n.IdNotificacion,
                IdTurno = n.IdTurno,
                Mensaje = n.Mensaje,
                Destinatario = n.Destinatario,
                FechaEnvio = n.FechaEnvio,
                Enviado = n.Enviado
            }));
        }

        [HttpGet("BuscarNotificacionPorId/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var notificacion = await _notificacionService.GetByIdAsync(id);
            if (notificacion == null) return NotFound();
            return Ok(new NotificacionResponseDTO
            {
                IdNotificacion = notificacion.IdNotificacion,
                IdTurno = notificacion.IdTurno,
                Mensaje = notificacion.Mensaje,
                Destinatario = notificacion.Destinatario,
                FechaEnvio = notificacion.FechaEnvio,
                Enviado = notificacion.Enviado
            });
        }

        [HttpGet("BuscarNotificacionesPorTurno/{idTurno}")]
        public async Task<IActionResult> GetByTurno(int idTurno)
        {
            var notificaciones = await _notificacionService.GetByTurnoAsync(idTurno);
            return Ok(notificaciones.Select(n => new NotificacionResponseDTO
            {
                IdNotificacion = n.IdNotificacion,
                IdTurno = n.IdTurno,
                Mensaje = n.Mensaje,
                Destinatario = n.Destinatario,
                FechaEnvio = n.FechaEnvio,
                Enviado = n.Enviado
            }));
        }

        [HttpPost("CrearNotificacion")]
        public async Task<IActionResult> Add(Notificacion notificacion)
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
            return Ok(notificaciones.Select(n => new NotificacionResponseDTO
            {
                IdNotificacion = n.IdNotificacion,
                IdTurno = n.IdTurno,
                Mensaje = n.Mensaje,
                Destinatario = n.Destinatario,
                FechaEnvio = n.FechaEnvio,
                Enviado = n.Enviado
            }));
        }
    }
}