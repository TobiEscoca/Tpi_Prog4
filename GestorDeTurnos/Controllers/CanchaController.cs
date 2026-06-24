using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CanchaController : ControllerBase
    {
        private readonly CanchaService _canchaService;

        public CanchaController(CanchaService canchaService)
        {
            _canchaService = canchaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var canchas = await _canchaService.GetAllAsync();
            return Ok(canchas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cancha = await _canchaService.GetByIdAsync(id);
            if (cancha == null) return NotFound();
            return Ok(cancha);
        }

        [HttpGet("complejo/{idComplejo}")]
        public async Task<IActionResult> GetByComplejo(int idComplejo)
        {
            var canchas = await _canchaService.GetByComplejoAsync(idComplejo);
            return Ok(canchas);
        }

        [HttpGet("complejo/{idComplejo}/activas")]
        public async Task<IActionResult> GetActivasByComplejo(int idComplejo)
        {
            var canchas = await _canchaService.GetActivasByComplejoAsync(idComplejo);
            return Ok(canchas);
        }

        [HttpPost]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Add(Cancha cancha)
        {
            await _canchaService.AddAsync(cancha);
            return CreatedAtAction(nameof(GetById), new { id = cancha.IdCancha }, cancha);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Update(int id, Cancha cancha)
        {
            if (id != cancha.IdCancha) return BadRequest();
            await _canchaService.UpdateAsync(cancha);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "DuenoComplejo")]
        public async Task<IActionResult> Delete(int id)
        {
            await _canchaService.DeleteAsync(id);
            return NoContent();
        }
    }
}