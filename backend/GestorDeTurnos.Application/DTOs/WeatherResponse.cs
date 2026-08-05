using System.Text.Json.Serialization;

namespace GestorDeTurnos.Application.DTOs;

// Respuesta final que devuelve tu API
public class WeatherResponse
{
    public string City { get; set; } = string.Empty;
    public double Temperature { get; set; }
    public double WindSpeed { get; set; }
    public int Humidity { get; set; }
}

// Respuesta del geocoding de Open-Meteo
public class GeocodingResponse
{
    [JsonPropertyName("results")]
    public List<GeocodingResult>? Results { get; set; }
}

public class GeocodingResult
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }
}

// Respuesta del clima de Open-Meteo
public class OpenMeteoResponse
{
    [JsonPropertyName("current")]
    public CurrentWeather Current { get; set; } = new();
}

public class CurrentWeather
{
    [JsonPropertyName("temperature_2m")]
    public double Temperature { get; set; }

    [JsonPropertyName("wind_speed_10m")]
    public double WindSpeed { get; set; }

    [JsonPropertyName("relative_humidity_2m")]
    public int Humidity { get; set; }
}