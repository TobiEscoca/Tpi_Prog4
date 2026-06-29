using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Application.Services;
using GestorDeTurnos.Infrastructure.Data;
using GestorDeTurnos.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Base de datos
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorios
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IComplejoRepository, ComplejoRepository>();
builder.Services.AddScoped<ICanchaRepository, CanchaRepository>();
builder.Services.AddScoped<ITurnoRepository, TurnoRepository>();
builder.Services.AddScoped<INotificacionRepository, NotificacionRepository>();

// Servicios
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<ComplejoService>();
builder.Services.AddScoped<CanchaService>();
builder.Services.AddScoped<TurnoService>();
builder.Services.AddScoped<NotificacionService>();

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

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ==========================================
// CONTROL DE BASE DE DATOS SEGÚN EL ENTORNO
// ==========================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    if (app.Environment.IsDevelopment())
    {
        // En tu PC Local: Solo aplica cambios pendientes. NO te borra los datos.
        db.Database.Migrate();
    }
    else
    {
        // En Azure: Fuerza el borrado del archivo fantasma que causa el choque de tablas
        db.Database.EnsureDeleted();
        db.Database.Migrate();
    }
}

app.Run();