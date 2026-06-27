using GestorDeTurnos.Application.DTOs;
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
            return Ok(usuarios);
        }

        [HttpGet("BuscarUsuarioPorId/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var usuario = await _usuarioService.GetByIdAsync(id);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }

        [HttpPost("Crear-usuario-admin")]
        [Authorize(Roles = "AdministradorGeneral")]
        public async Task<IActionResult> Register(CrearUsuarioAdminRequest request)
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

            var hayCambios = false;

            if (request.Nombre != null)
            {
                if (string.IsNullOrWhiteSpace(request.Nombre))
                    return BadRequest("El nombre no puede estar vacío.");

                usuario.Nombre = request.Nombre.Trim();
                hayCambios = true;
            }

            if (request.Email != null)
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                    return BadRequest("El email no puede estar vacío.");

                var existente = await _usuarioService.GetByEmailAsync(request.Email);
                if (existente != null && existente.IdUsuario != id)
                    return BadRequest("El email ya está en uso por otro usuario.");

                usuario.Email = request.Email.Trim();
                hayCambios = true;
            }

            if (request.Activo.HasValue)
            {
                usuario.Activo = request.Activo.Value;
                hayCambios = true;
            }

            if (request.RolUsuario.HasValue)
            {
                usuario.Rol = request.RolUsuario.Value;
                hayCambios = true;
            }

            if (!hayCambios)
                return BadRequest("Debes enviar al menos uno de estos campos: nombre, email o activo.");

            await _usuarioService.UpdateAsync(usuario);
            return Ok(usuario);
        }

        [HttpDelete("EliminarUsuario/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _usuarioService.DeleteAsync(id);
            return NoContent();
        }
    }

    public class CrearUsuarioAdminRequest
    {
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public RolUsuario RolUsuario { get; set; }
    }
}
