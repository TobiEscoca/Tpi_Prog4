
using GestorDeTurnos.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GestorDeTurnos.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class WeatherController : ControllerBase
{
    private readonly IWeatherService _weatherService;

    public WeatherController(IWeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet("ObtenerClimaPorCiudad/{city}")]
    public async Task<IActionResult> GetByCity(string city)
    {
        var weather = await _weatherService.GetWeatherAsync(city);

        if (weather is null)
            return NotFound(new { message = $"No se encontró clima para '{city}'" });

        return Ok(weather);
    }
}