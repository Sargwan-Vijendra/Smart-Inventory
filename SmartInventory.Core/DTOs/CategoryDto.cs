using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public class CategoryDto
    {
        // For creating a new category
        public record CategoryCreateDto(string Name);

        // For returning category details
        public record CategoryViewDto(int Id, string Name);

        // Added for Pagination support
        public record CategoryPagedResponseDto(
            IEnumerable<CategoryViewDto> Items,
            int TotalCount,
            int PageNumber,
            int PageSize
        );
    }
}
