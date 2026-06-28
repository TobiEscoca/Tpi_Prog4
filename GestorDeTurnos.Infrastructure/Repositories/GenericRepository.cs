using System;
using System.Collections.Generic;
using System.Text;
using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;
using GestorDeTurnos.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GestorDeTurnos.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            IQueryable<T> query = _dbSet;

            if (typeof(T) == typeof(Complejo))
            {
                query = (IQueryable<T>)_context.Complejos.Include(c => c.Dueno).Include(c => c.Canchas);
            }
            else if (typeof(T) == typeof(Cancha))
            {
                query = (IQueryable<T>)_context.Canchas.Include(c => c.Turnos);
            }
            else if (typeof(T) == typeof(Turno))
            {
                query = (IQueryable<T>)_context.Turnos
                    .Include(t => t.Cancha)
                    .Include(t => t.Notificaciones);
            }
            else if (typeof(T) == typeof(Usuario))
            {
                query = (IQueryable<T>)_context.Usuarios
                .Include(u => u.Complejos)
                .ThenInclude(c => c.Canchas);
            }

            return await query.ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);

            if (entity is Complejo complejo)
            {
                await _context.Entry(complejo).Collection(c => c.Canchas).LoadAsync();
                await _context.Entry(complejo).Reference(c => c.Dueno).LoadAsync();
            }
            else if (entity is Cancha cancha)
            {
                await _context.Entry(cancha).Collection(c => c.Turnos).LoadAsync();
                await _context.Entry(cancha).Reference(c => c.Complejo).LoadAsync();
            }
            else if (entity is Turno turno)
            {
                await _context.Entry(turno).Reference(t => t.Cancha).LoadAsync();
                await _context.Entry(turno).Collection(t => t.Notificaciones).LoadAsync();
            }
            else if (entity is Usuario usuario)
            {
                await _context.Entry(usuario).Collection(u => u.Complejos).LoadAsync();
            }

            return entity;
        }

        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}