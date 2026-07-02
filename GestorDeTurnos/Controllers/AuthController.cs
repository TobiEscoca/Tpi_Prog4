using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestorDeTurnos.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IJwtService _jwtService;

        public AuthController(IUsuarioRepository usuarioRepository, IJwtService jwtService)
        {
            _usuarioRepository = usuarioRepository;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var existe = await _usuarioRepository.GetByEmailAsync(request.Email);
            if (existe != null)
                return BadRequest("Ya existe un usuario con ese email.");

            var usuario = new Usuario
            {
                Nombre = request.Nombre,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Rol = RolUsuario.Cliente,
                Activo = true,
                FechaRegistro = DateTime.UtcNow
            };

            await _usuarioRepository.AddAsync(usuario);
            return Ok("Usuario registrado correctamente.");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var usuario = await _usuarioRepository.GetByEmailAsync(request.Email);

            // 1. Primero validamos si el email existe
            if (usuario == null)
                return Unauthorized("Email o contraseña incorrectos.");

            // =======================================================================
            // 2. BYPASS TEMPORAL PARA EL ADMIN EN AZURE 
            // Si coincide el mail y la clave en texto plano, entra directo sin usar BCrypt
            // =======================================================================
            if (usuario.Email == "admin@futbol5.com" && request.Password == "Admin123")
            {
                if (!usuario.Activo)
                    return Unauthorized("El usuario está desactivado.");

                var tokenAdmin = _jwtService.GenerateToken(usuario);
                return Ok(new { token = tokenAdmin });
            }
            // =======================================================================

            // 3. Validación normal con BCrypt para el resto de los mortales
            if (!BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
                return Unauthorized("Email o contraseña incorrectos.");

            if (!usuario.Activo)
                return Unauthorized("El usuario está desactivado.");

            var token = _jwtService.GenerateToken(usuario);
            return Ok(new { token });
        }
    }
}