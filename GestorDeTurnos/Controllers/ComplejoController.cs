using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ComplejoController : ControllerBase
    {
        private readonly ComplejoService _complejoService;

        public ComplejoController(ComplejoService complejoService)
        {
            _complejoService = complejoService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            var complejos = await _complejoService.GetAllAsync();
            return Ok(complejos);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> GetById(int id)
        {
            var complejo = await _complejoService.GetByIdAsync(id);
            if (complejo == null) return NotFound();
            return Ok(complejo);
        }

        [HttpGet("dueno/{idDueno}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> GetByDueno(int idDueno)
        {
            var complejos = await _complejoService.GetByDuenoAsync(idDueno);
            return Ok(complejos);
        }

        [HttpGet("activos")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> GetActivos()
        {
            var complejos = await _complejoService.GetActivosAsync();
            return Ok(complejos);
        }

        [HttpPost]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Add(Complejo complejo)
        {
            await _complejoService.AddAsync(complejo);
            return CreatedAtAction(nameof(GetById), new { id = complejo.IdComplejo }, complejo);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Update(int id, Complejo complejo)
        {
            if (id != complejo.IdComplejo) return BadRequest();
            await _complejoService.UpdateAsync(complejo);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Delete(int id)
        {
            await _complejoService.DeleteAsync(id);
            return NoContent();
        }
    }
}