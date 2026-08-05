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
        private readonly IConfiguration _configuration;

        public AuthController(IUsuarioRepository usuarioRepository, IJwtService jwtService, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _jwtService = jwtService;
            _configuration = configuration;
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

        [HttpPost("register-admin")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterAdminRequest request)
        {
            var expectedKey = _configuration["AdminSecretKey"];

            if (string.IsNullOrEmpty(expectedKey))
                return StatusCode(500, "La clave de admin no está configurada en el servidor.");

            if (request.AdminSecretKey != expectedKey)
                return Forbid("Clave de admin incorrecta.");

            var existe = await _usuarioRepository.GetByEmailAsync(request.Email);
            if (existe != null)
                return BadRequest("Ya existe un usuario con ese email.");

            var usuario = new Usuario
            {
                Nombre = request.Nombre,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Rol = RolUsuario.AdministradorGeneral,
                Activo = true,
                FechaRegistro = DateTime.UtcNow
            };

            await _usuarioRepository.AddAsync(usuario);
            return Ok("Administrador registrado correctamente.");
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var usuario = await _usuarioRepository.GetByEmailAsync(request.Email);

    if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
        return Unauthorized("Email o contraseña incorrectos.");

    if (!usuario.Activo)
        return Unauthorized("El usuario está desactivado.");

    var token = _jwtService.GenerateToken(usuario);
    return Ok(new { token });
}
    }
}