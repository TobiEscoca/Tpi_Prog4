using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Application.Mappings;
using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "AdministradorGeneral")]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioService _usuarioService;

        public UsuarioController(UsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        [HttpGet("ObtenerUsuarios")]
        public async Task<IActionResult> GetAll()
        {
            var usuarios = await _usuarioService.GetAllAsync();
            return Ok(usuarios.Select(u => u.ToDto()));
        }

        [HttpGet("BuscarUsuarioPorId/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario == null) return NotFound();
            return Ok(usuario.ToDto());
        }

        [HttpPost("Crear-usuario-admin")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Register([FromBody] CrearUsuarioAdminRequest request)
        {
            var existe = await _usuarioService.GetByEmailAsync(request.Email);
            if (existe != null)
                return BadRequest("Ya existe un usuario con ese email.");

            var usuario = new Usuario
            {
                Nombre = request.Nombre,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Rol = request.RolUsuario,
                Activo = true,
                FechaRegistro = DateTime.UtcNow
            };

            await _usuarioService.AddAsync(usuario);
            return Ok("Usuario registrado correctamente.");
        }

        [HttpPut("ActualizarUsuario/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ActualizarUsuarioRequest request)
        {
            if (request == null)
                return BadRequest("Se requiere un cuerpo con los datos a actualizar.");

            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario == null)
                return NotFound("No existe el usuario indicado.");

            if (!request.HasChanges)
                return BadRequest("Debes enviar al menos uno de estos campos: nombre, email, activo o rol.");

            if (request.Email != null)
            {
                var existente = await _usuarioService.GetByEmailAsync(request.Email);
                if (existente != null && existente.IdUsuario != id)
                    return BadRequest("El email ya está en uso por otro usuario.");
            }

            var errors = request.ApplyTo(usuario);
            if (errors.Any())
                return BadRequest(string.Join("; ", errors));

            await _usuarioService.UpdateAsync(usuario);
            return Ok(usuario.ToDto());
        }

        [HttpDelete("EliminarUsuario/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _usuarioService.DeleteAsync(id);
            return NoContent();
        }
    }
}
