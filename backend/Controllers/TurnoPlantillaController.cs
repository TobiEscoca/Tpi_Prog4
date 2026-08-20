using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TurnoPlantillaController : ControllerBase
    {
        private readonly TurnoPlantillaService _plantillaService;
        private readonly CanchaService _canchaService;
        private readonly ComplejoService _complejoService;

        public TurnoPlantillaController(
            TurnoPlantillaService plantillaService,
            CanchaService canchaService,
            ComplejoService complejoService)
        {
            _plantillaService = plantillaService;
            _canchaService = canchaService;
            _complejoService = complejoService;
        }

        [HttpGet("PorCancha/{idCancha}")]
        public async Task<IActionResult> GetByCancha(int idCancha)
        {
            var cancha = await _canchaService.GetByIdAsync(idCancha);
            if (cancha == null) return NotFound("Cancha no encontrada.");

            if (!User.IsInRole("AdministradorGeneral"))
            {
                var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var complejo = await _complejoService.GetByIdAsync(cancha.IdComplejo);
                if (complejo == null || complejo.IdDueno != idUsuario)
                    return Forbid("No tenés acceso a esta cancha.");
            }

            var plantillas = await _plantillaService.GetByCanchaAsync(idCancha);
            return Ok(plantillas.Select(p => new TurnoPlantillaDTO
            {
                IdPlantilla = p.IdPlantilla,
                IdCancha = p.IdCancha,
                DiaSemana = p.DiaSemana,
                HoraInicio = p.HoraInicio.ToString(@"hh\:mm"),
                HoraFin = p.HoraFin.ToString(@"hh\:mm"),
                Activo = p.Activo
            }));
        }

        [HttpPut("Toggle/{id}")]
        [Authorize(Roles = "DuenoComplejo, AdministradorGeneral")]
        public async Task<IActionResult> Toggle(int id, [FromQuery] bool activo)
        {
            var plantilla = await _plantillaService.GetByIdAsync(id);
            if (plantilla == null) return NotFound("Plantilla no encontrada.");

            if (!User.IsInRole("AdministradorGeneral"))
            {
                var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var cancha = await _canchaService.GetByIdAsync(plantilla.IdCancha);
                if (cancha == null) return NotFound();
                var complejo = await _complejoService.GetByIdAsync(cancha.IdComplejo);
                if (complejo == null || complejo.IdDueno != idUsuario)
                    return Forbid("No tenés acceso a esta cancha.");
            }

            await _plantillaService.TogglePlantillaAsync(id, activo);
            return Ok(activo ? "Plantilla activada." : "Plantilla desactivada. Reservas canceladas.");
        }

        [HttpPut("BulkToggle")]
        [Authorize(Roles = "DuenoComplejo, AdministradorGeneral")]
        public async Task<IActionResult> BulkToggle([FromBody] BulkToggleRequest request)
        {
            if (request.Plantillas == null || request.Plantillas.Count == 0)
                return BadRequest("Debe enviar al menos una plantilla.");

            await _plantillaService.BulkToggleAsync(request.Plantillas);
            return Ok("Plantillas actualizadas correctamente.");
        }
    }
}
