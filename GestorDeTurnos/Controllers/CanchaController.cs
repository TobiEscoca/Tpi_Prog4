using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CanchaController : ControllerBase
    {
        private readonly CanchaService _canchaService;
        private readonly ComplejoService _complejoService;

        public CanchaController(CanchaService canchaService, ComplejoService complejoService)
        {
            _canchaService = canchaService;
            _complejoService = complejoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var canchas = await _canchaService.GetAllAsync();
            return Ok(canchas.Select(c => new CanchaResumenDTO
            {
                IdCancha = c.IdCancha,
                Nombre = c.Nombre,
                PrecioHora = c.PrecioHora,
                Activo = c.Activo,
                IdComplejo = c.IdComplejo
            }));
        }

        [HttpGet("BuscarCanchaPorId/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cancha = await _canchaService.GetByIdAsync(id);
            if (cancha == null) return NotFound();
            return Ok(new CanchaResponseDTO
            {
                IdCancha = cancha.IdCancha,
                IdComplejo = cancha.IdComplejo,
                NombreComplejo = cancha.Complejo?.Nombre ?? string.Empty,
                Nombre = cancha.Nombre,
                PrecioHora = cancha.PrecioHora,
                Activo = cancha.Activo,
                Turnos = cancha.Turnos.Select(t => new TurnoResponseDTO
                {
                    IdTurno = t.IdTurno,
                    IdCancha = t.IdCancha,
                    IdCliente = t.IdCliente,
                    FechaHoraInicio = t.FechaHoraInicio,
                    FechaHoraFin = t.FechaHoraFin,
                    Estado = t.Estado.ToString(),
                }).ToList()
            });
        }

        [HttpGet("BuscarPorComplejo/{idComplejo}")]
        public async Task<IActionResult> GetByComplejo(int idComplejo)
        {
            var canchas = await _canchaService.GetByComplejoAsync(idComplejo);
            return Ok(canchas.Select(c => new CanchaResumenDTO
            {
                IdCancha = c.IdCancha,
                IdComplejo = c.IdComplejo,
                Nombre = c.Nombre,
                PrecioHora = c.PrecioHora,
                Activo = c.Activo,
            }));
        }

        [HttpGet("BuscarActivasPorComplejo/{idComplejo}")]
        public async Task<IActionResult> GetActivasByComplejo(int idComplejo)
        {
            var canchas = await _canchaService.GetActivasByComplejoAsync(idComplejo);
            return Ok(canchas.Select(c => new CanchaResumenDTO
            {
                IdCancha = c.IdCancha,
                IdComplejo = c.IdComplejo,
                Nombre = c.Nombre,
                PrecioHora = c.PrecioHora,
                Activo = c.Activo
            }));
        }

        [HttpPost("CrearCancha")]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Add([FromBody] CrearCanchaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre))
                return BadRequest("El nombre de la cancha es obligatorio.");

            if (request.PrecioHora <= 0)
                return BadRequest("El precio por hora debe ser mayor a cero.");

            if (request.IdComplejo <= 0)
                return BadRequest("El id del complejo es obligatorio.");

            var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var complejo = await _complejoService.GetByIdAsync(request.IdComplejo);

            if (complejo == null)
                return NotFound("No existe el complejo indicado.");

            if (complejo.IdDueno != idUsuario)
                return Forbid("Solo puedes crear canchas para complejos que te pertenecen.");

            var cancha = new Cancha
            {
                IdComplejo = request.IdComplejo,
                Nombre = request.Nombre.Trim(),
                PrecioHora = request.PrecioHora,
                Activo = true,
                Complejo = complejo
            };

            complejo.Canchas.Add(cancha);

            await _canchaService.AddAsync(cancha);
            return CreatedAtAction(nameof(GetById), new { id = cancha.IdCancha }, new CanchaResumenDTO
            {
                IdCancha = cancha.IdCancha,
                IdComplejo = cancha.IdComplejo,
                Nombre = cancha.Nombre,
                PrecioHora = cancha.PrecioHora,
                Activo = cancha.Activo
            });
        }

        [HttpPut("ActualizarCancha/{id}")]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Update(int id, [FromBody] ActualizarCanchaRequest request)
        {
            if (request == null)
                return BadRequest("Se requiere un cuerpo con los datos a actualizar.");

            var cancha = await _canchaService.GetByIdAsync(id);
            if (cancha == null)
                return NotFound("No existe la cancha indicada.");

            var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var complejo = await _complejoService.GetByIdAsync(cancha.IdComplejo);

            if (complejo == null)
                return NotFound("No existe el complejo asociado a la cancha.");

            if (complejo.IdDueno != idUsuario)
                return Forbid("Solo puedes editar canchas de tus complejos.");

            var hayCambios = false;

            if (request.Nombre != null)
            {
                if (string.IsNullOrWhiteSpace(request.Nombre))
                    return BadRequest("El nombre no puede estar vacío.");

                cancha.Nombre = request.Nombre.Trim();
                hayCambios = true;
            }

            if (request.PrecioHora.HasValue)
            {
                if (request.PrecioHora <= 0)
                    return BadRequest("El precio por hora debe ser mayor a cero.");

                cancha.PrecioHora = request.PrecioHora.Value;
                hayCambios = true;
            }

            if (request.Activo.HasValue)
            {
                cancha.Activo = request.Activo.Value;
                hayCambios = true;
            }

            if (!hayCambios)
                return BadRequest("Debes enviar al menos uno de estos campos: nombre, precioHora o activo.");

            await _canchaService.UpdateAsync(cancha);
            return Ok("Cancha actualizada correctamente.");
        }

        [HttpDelete("EliminarCancha/{id}")]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Delete(int id)
        {
            await _canchaService.DeleteAsync(id);
            return Ok("Cancha eliminada correctamente.");
        }
    }
}