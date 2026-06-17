using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestorDeTurnos.Infrastructure.Repositories
{
    public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(ApplicationDbContext context) : base(context) { }

        public async Task<Usuario?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}
