

using GestorDeTurnos.Application.DTOs;

namespace GestorDeTurnos.Application.Interfaces;

public interface IWeatherService
{
    Task<WeatherResponse?> GetWeatherAsync(string city);
}