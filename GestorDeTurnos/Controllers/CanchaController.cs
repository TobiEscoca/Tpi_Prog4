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
            return Ok(canchas);
        }

        [HttpGet("BuscarCanchaPorId/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cancha = await _canchaService.GetByIdAsync(id);
            if (cancha == null) return NotFound();
            return Ok(cancha);
        }

        [HttpGet("BuscarPorComplejo/{idComplejo}")]
        public async Task<IActionResult> GetByComplejo(int idComplejo)
        {
            var canchas = await _canchaService.GetByComplejoAsync(idComplejo);
            return Ok(canchas);
        }

        [HttpGet("BuscarActivasPorComplejo/{idComplejo}")]
        public async Task<IActionResult> GetActivasByComplejo(int idComplejo)
        {
            var canchas = await _canchaService.GetActivasByComplejoAsync(idComplejo);
            return Ok(canchas);
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
                Activo = true
            };

            await _canchaService.AddAsync(cancha);
            return CreatedAtAction(nameof(GetById), new { id = cancha.IdCancha }, cancha);
        }

        [HttpPut("ActualizarCancha/{id}")]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Update(int id, Cancha cancha)
        {
            if (id != cancha.IdCancha) return BadRequest();
            await _canchaService.UpdateAsync(cancha);
            return NoContent();
        }

        [HttpDelete("EliminarCancha/{id}")]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Delete(int id)
        {
            await _canchaService.DeleteAsync(id);
            return NoContent();
        }
    }
}