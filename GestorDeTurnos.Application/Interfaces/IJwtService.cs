using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(Usuario usuario);
}
