using System.Text.Json;
using GestorDeTurnos.Application.DTOs;
using GestorDeTurnos.Application.Interfaces;
using Microsoft.Extensions.Configuration;

public class WeatherService : IWeatherService
{
    private readonly HttpClient _httpClient;
    private readonly string _geocodingUrl;
    private readonly string _weatherUrl;

    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public WeatherService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _geocodingUrl = config["OpenMeteo:GeocodingUrl"]
            ?? throw new InvalidOperationException("Falta GeocodingUrl");
        _weatherUrl = config["OpenMeteo:BaseUrl"]
            ?? throw new InvalidOperationException("Falta BaseUrl");
    }

    public async Task<WeatherResponse?> GetWeatherAsync(string city)
    {
        // 1. Geocoding — URL absoluta completa
        var geoUrl = $"{_geocodingUrl}search?name={Uri.EscapeDataString(city)}&count=1";
        var geoResponse = await _httpClient.GetAsync(geoUrl);

        if (!geoResponse.IsSuccessStatusCode) return null;

        var geoJson = await geoResponse.Content.ReadAsStringAsync();
        var geoData = JsonSerializer.Deserialize<GeocodingResponse>(geoJson, _jsonOptions);

        if (geoData?.Results is null || geoData.Results.Count == 0) return null;

        var location = geoData.Results[0];

        // 2. Clima — URL absoluta completa
        var weatherUrl = $"{_weatherUrl}forecast" +
                 $"?latitude={location.Latitude.ToString(System.Globalization.CultureInfo.InvariantCulture)}" +
                 $"&longitude={location.Longitude.ToString(System.Globalization.CultureInfo.InvariantCulture)}" +
                 $"&current=temperature_2m,wind_speed_10m,relative_humidity_2m";
        var weatherResponse = await _httpClient.GetAsync(weatherUrl);

        if (!weatherResponse.IsSuccessStatusCode) return null;

        var weatherJson = await weatherResponse.Content.ReadAsStringAsync();
        var weatherData = JsonSerializer.Deserialize<OpenMeteoResponse>(weatherJson, _jsonOptions);

        if (weatherData is null) return null;

        return new WeatherResponse
        {
            City = location.Name,
            Temperature = weatherData.Current.Temperature,
            WindSpeed = weatherData.Current.WindSpeed,
            Humidity = weatherData.Current.Humidity
        };
    }
}