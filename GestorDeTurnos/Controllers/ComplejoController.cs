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
    public class ComplejoController : ControllerBase
    {
        private readonly ComplejoService _complejoService;
        private readonly UsuarioService _usuarioService;

        public ComplejoController(ComplejoService complejoService, UsuarioService usuarioService)
        {
            _complejoService = complejoService;
            _usuarioService = usuarioService;
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

        [HttpGet("BuscarPorDueno/{idDueno}")]
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

        [HttpPost("CrearComplejo")]
        [Authorize(Roles = "AdministradorGeneral, DuenoComplejo")]
        public async Task<IActionResult> Add([FromBody] CrearComplejoRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre))
                return BadRequest("El nombre del complejo es obligatorio.");

            if (string.IsNullOrWhiteSpace(request.Direccion))
                return BadRequest("La dirección del complejo es obligatoria.");

            var idUsuario = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var usuario = await _usuarioService.GetByIdAsync(idUsuario);

            if (usuario == null)
                return NotFound("No existe el usuario autenticado.");

            var complejo = new Complejo
            {
                IdDueno = idUsuario,
                Nombre = request.Nombre.Trim(),
                Direccion = request.Direccion.Trim(),
                Telefono = string.IsNullOrWhiteSpace(request.Telefono) ? null : request.Telefono.Trim(),
                Email = usuario.Email,
                Dueno = usuario,
                Activo = true,
            };

            await _complejoService.AddAsync(complejo);
            return CreatedAtAction(nameof(GetById), new { id = complejo.IdComplejo }, complejo);
        }

        [HttpPut("ActualizarComplejo/{id}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Update(int id, Complejo complejo)
        {
            if (id != complejo.IdComplejo) return BadRequest();
            await _complejoService.UpdateAsync(complejo);
            return NoContent();
        }

        [HttpDelete("EliminarComplejo/{id}")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Delete(int id)
        {
            await _complejoService.DeleteAsync(id);
            return NoContent();
        }
    }
}