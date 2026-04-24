using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public record SupplierViewDto(int Id, string Name, string Email, string Phone);
    public record SupplierRequestDto(string Name, string Email, string Phone);
}
