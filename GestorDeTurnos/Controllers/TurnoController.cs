using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TurnoController : ControllerBase
    {
        private readonly TurnoService _turnoService;

        public TurnoController(TurnoService turnoService)
        {
            _turnoService = turnoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var turnos = await _turnoService.GetAllAsync();
            return Ok(turnos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var turno = await _turnoService.GetByIdAsync(id);
            if (turno == null) return NotFound();
            return Ok(turno);
        }

        [HttpGet("cliente/{idCliente}")]
        public async Task<IActionResult> GetByCliente(int idCliente)
        {
            var turnos = await _turnoService.GetByClienteAsync(idCliente);
            return Ok(turnos);
        }

        [HttpGet("cancha/{idCancha}")]
        public async Task<IActionResult> GetByCancha(int idCancha)
        {
            var turnos = await _turnoService.GetByCanchaAsync(idCancha);
            return Ok(turnos);
        }

        [HttpPost]
        public async Task<IActionResult> Add(Turno turno)
        {
            try
            {
                await _turnoService.AddAsync(turno);
                return CreatedAtAction(nameof(GetById), new { id = turno.IdTurno }, turno);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/confirmar")]
        public async Task<IActionResult> Confirmar(int id)
        {
            try
            {
                await _turnoService.ConfirmarAsync(id);
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

        [HttpPut("{id}/cancelar")]
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _turnoService.DeleteAsync(id);
            return NoContent();
        }
    }
}