using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static SmartInventory.Core.DTOs.CategoryDto;

namespace SmartInventory.Core.DTOs
{
    public record SupplierViewDto(int Id, string Name, string Email, string Phone);
    public record SupplierRequestDto(string Name, string Email, string Phone);

    // Added for Pagination support
    public record SupplierPagedResponseDto(
        IEnumerable<SupplierViewDto> Items,
        int TotalCount,
        int PageNumber,
        int PageSize
    );
}
