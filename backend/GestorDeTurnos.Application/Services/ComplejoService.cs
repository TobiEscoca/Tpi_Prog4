using GestorDeTurnos.Application.Interfaces;
using GestorDeTurnos.Domain.Entities;

namespace GestorDeTurnos.Application.Services
{
    public class ComplejoService
    {
        private readonly IComplejoRepository _complejoRepository;

        public ComplejoService(IComplejoRepository complejoRepository)
        {
            _complejoRepository = complejoRepository;
        }

        public async Task<IEnumerable<Complejo>> GetAllAsync()
        {
            return await _complejoRepository.GetAllAsync();
        }

        public async Task<Complejo?> GetByIdAsync(int id)
        {
            return await _complejoRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Complejo>> GetByDuenoAsync(int idDueno)
        {
            return await _complejoRepository.GetByDuenoAsync(idDueno);
        }

        public async Task<IEnumerable<Complejo>> GetActivosAsync()
        {
            return await _complejoRepository.GetActivosAsync();
        }

        public async Task AddAsync(Complejo complejo)
        {
            await _complejoRepository.AddAsync(complejo);
        }

        public async Task UpdateAsync(Complejo complejo)
        {
            await _complejoRepository.UpdateAsync(complejo);
        }

        public async Task DeleteAsync(int id)
        {
            await _complejoRepository.DeleteAsync(id);
        }
    }
}