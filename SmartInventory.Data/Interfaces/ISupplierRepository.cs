using SmartInventory.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Data.Interfaces
{
    public interface ISupplierRepository
    {
        Task<IEnumerable<SupplierViewDto>> GetAllAsync();
        Task<int> CreateAsync(SupplierRequestDto dto);
        Task UpdateAsync(int id, SupplierRequestDto dto);
        Task DeleteAsync(int id); // We'll reuse the IsDeleted logic here too
    }
}
