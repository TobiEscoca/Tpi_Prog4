using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Services
{
    public class CanchaService
    {
        private readonly ICanchaRepository _canchaRepository;

        public CanchaService(ICanchaRepository canchaRepository)
        {
            _canchaRepository = canchaRepository;
        }

        public async Task<IEnumerable<Cancha>> GetAllAsync()
        {
            return await _canchaRepository.GetAllAsync();
        }

        public async Task<Cancha?> GetByIdAsync(int id)
        {
            return await _canchaRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Cancha>> GetByComplejoAsync(int idComplejo)
        {
            return await _canchaRepository.GetByComplejoAsync(idComplejo);
        }

        public async Task<IEnumerable<Cancha>> GetActivasByComplejoAsync(int idComplejo)
        {
            return await _canchaRepository.GetActivasByComplejoAsync(idComplejo);
        }

        public async Task AddAsync(Cancha cancha)
        {
            await _canchaRepository.AddAsync(cancha);
        }

        public async Task UpdateAsync(Cancha cancha)
        {
            await _canchaRepository.UpdateAsync(cancha);
        }

        public async Task DeleteAsync(int id)
        {
            await _canchaRepository.DeleteAsync(id);
        }
    }
}