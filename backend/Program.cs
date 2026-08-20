using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Infrastructure.Data;
using GestorDeTurnos.Infrastructure.Repositories;
using GestorDeTurnos.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Base de datos — PostgreSQL en producción, SQLite en local
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL")))
    {
        var uri = new Uri(connectionString!);
        var userInfo = uri.UserInfo.Split(':');
        var npgsql = new NpgsqlConnectionStringBuilder
        {
            Host = uri.Host,
            Port = uri.Port > 0 ? uri.Port : 5432,
            Database = uri.AbsolutePath.TrimStart('/'),
            Username = Uri.UnescapeDataString(userInfo[0]),
            Password = Uri.UnescapeDataString(userInfo.Length > 1 ? userInfo[1] : ""),
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };
        options.UseNpgsql(npgsql.ConnectionString);
    }
    else
        options.UseSqlite(connectionString);
});

// Repositorios
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IComplejoRepository, ComplejoRepository>();
builder.Services.AddScoped<ICanchaRepository, CanchaRepository>();
builder.Services.AddScoped<ITurnoRepository, TurnoRepository>();
builder.Services.AddScoped<INotificacionRepository, NotificacionRepository>();
builder.Services.AddScoped<ITurnoPlantillaRepository, TurnoPlantillaRepository>();

// Servicios
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<ComplejoService>();
builder.Services.AddScoped<CanchaService>();
builder.Services.AddScoped<TurnoService>();
builder.Services.AddScoped<NotificacionService>();
builder.Services.AddScoped<EliminacionEnCascadaService>();
builder.Services.AddScoped<TurnoPlantillaService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// Background service para expiración y renovación de turnos
builder.Services.AddHostedService<TurnoExpirationService>();

// JWT
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!))
        };
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "GestorDeTurnos",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresa: tu_token"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddHttpClient<IWeatherService, WeatherService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        var envOrigins = Environment.GetEnvironmentVariable("CORS_ORIGINS");
        var origins = envOrigins != null
            ? envOrigins.Split(',')
            : new[] { "http://localhost:5173", "http://localhost:5174" };
        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.WebHost.UseUrls($"http://+:{Environment.GetEnvironmentVariable("PORT") ?? "5000"}");

var app = builder.Build();

// Habilitamos Swagger para TODOS los entornos (tanto Local como Azure)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    // Esto hace que Swagger sea la página principal. 
    // Al entrar al link de Azure directamente, te va a abrir Swagger en vez del error 404.
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "GestorDeTurnos v1");
    c.RoutePrefix = string.Empty;
});

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ==========================================
// BASE DE DATOS
// ==========================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
}

app.Run();