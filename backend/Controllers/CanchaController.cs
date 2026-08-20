using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Application.Mappings;
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
        private readonly EliminacionEnCascadaService _eliminacionService;
        private readonly TurnoPlantillaService _plantillaService;

        public CanchaController(
            CanchaService canchaService,
            ComplejoService complejoService,
            EliminacionEnCascadaService eliminacionService,
            TurnoPlantillaService plantillaService)
        {
            _canchaService = canchaService;
            _complejoService = complejoService;
            _eliminacionService = eliminacionService;
            _plantillaService = plantillaService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var canchas = await _canchaService.GetAllAsync();
            return Ok(canchas.Select(c => c.ToResumen()));
        }

        [HttpGet("BuscarCanchaPorId/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var cancha = await _canchaService.GetByIdAsync(id);
            if (cancha == null) return NotFound();
            return Ok(cancha.ToDto());
        }

        [HttpGet("BuscarPorComplejo/{idComplejo}")]
        public async Task<IActionResult> GetByComplejo(int idComplejo)
        {
            var canchas = await _canchaService.GetByComplejoAsync(idComplejo);
            return Ok(canchas.Select(c => c.ToResumen()));
        }

        [HttpGet("BuscarActivasPorComplejo/{idComplejo}")]
        public async Task<IActionResult> GetActivasByComplejo(int idComplejo)
        {
            var canchas = await _canchaService.GetActivasByComplejoAsync(idComplejo);
            return Ok(canchas.Select(c => c.ToResumen()));
        }

        [HttpPost("CrearCancha")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> Add([FromBody] CrearCanchaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre))
                return BadRequest("El nombre de la cancha es obligatorio.");

            if (request.PrecioHora <= 0)
                return BadRequest("El precio por hora debe ser mayor a cero.");

            if (request.IdComplejo <= 0)
                return BadRequest("El id del complejo es obligatorio.");

            var complejo = await _complejoService.GetByIdAsync(request.IdComplejo);

            if (complejo == null)
                return NotFound("No existe el complejo indicado.");

            var esAdmin = User.IsInRole("AdministradorGeneral");
            if (!esAdmin)
            {
                var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                if (complejo.IdDueno != idUsuario)
                    return Forbid("Solo puedes crear canchas para complejos que te pertenecen.");
            }

            var cancha = new Cancha
            {
                IdComplejo = request.IdComplejo,
                Nombre = request.Nombre.Trim(),
                PrecioHora = request.PrecioHora,
                UrlImagen = request.UrlImagen?.Trim(),
                Activo = true,
                Complejo = complejo
            };

            complejo.Canchas.Add(cancha);

            await _canchaService.AddAsync(cancha);

            if (request.Horarios != null && request.Horarios.Count > 0)
            {
                var horariosParseados = new Dictionary<int, (string apertura, string cierre)>();
                foreach (var kvp in request.Horarios)
                {
                    if (int.TryParse(kvp.Key, out int dia) &&
                        !string.IsNullOrWhiteSpace(kvp.Value.Apertura) &&
                        !string.IsNullOrWhiteSpace(kvp.Value.Cierre))
                    {
                        horariosParseados[dia] = (kvp.Value.Apertura.Trim(), kvp.Value.Cierre.Trim());
                    }
                }

                if (horariosParseados.Count > 0)
                {
                    await _plantillaService.CrearPlantillasInicialesAsync(cancha.IdCancha, horariosParseados);
                }
            }

            return CreatedAtAction(nameof(GetById), new { id = cancha.IdCancha }, cancha.ToResumen());
        }

        [HttpPut("ActualizarCancha/{id}")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> Update(int id, [FromBody] ActualizarCanchaRequest request)
        {
            if (request == null)
                return BadRequest("Se requiere un cuerpo con los datos a actualizar.");

            var cancha = await _canchaService.GetByIdAsync(id);
            if (cancha == null)
                return NotFound("No existe la cancha indicada.");

            var esAdmin = User.IsInRole("AdministradorGeneral");
            if (!esAdmin)
            {
                var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var complejo = await _complejoService.GetByIdAsync(cancha.IdComplejo);

                if (complejo == null)
                    return NotFound("No existe el complejo asociado a la cancha.");

                if (complejo.IdDueno != idUsuario)
                    return Forbid("Solo puedes editar canchas de tus complejos.");
            }

            if (!request.HasChanges)
                return BadRequest("Debes enviar al menos uno de estos campos: nombre, precioHora o activo.");

            var errors = request.ApplyTo(cancha);
            if (errors.Any())
                return BadRequest(string.Join("; ", errors));

            await _canchaService.UpdateAsync(cancha);
            return Ok("Cancha actualizada correctamente.");
        }

        [HttpDelete("EliminarCancha/{id}")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> Delete(int id)
        {
            await _eliminacionService.EliminarCanchaAsync(id);
            return Ok("Cancha eliminada correctamente.");
        }
    }
}