using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static SmartInventory.Core.DTOs.CategoryDto;

namespace SmartInventory.Data.Interfaces
{
    public interface ICategoryRepository
    {
        //Task<IEnumerable<CategoryViewDto>> GetAllAsync();

        Task<CategoryPagedResponseDto> GetAllAsync(int pageNumber, int pageSize);
        Task<int> CreateAsync(CategoryCreateDto dto);
        Task DeleteAsync(int id);
    }
}
