using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public record ReorderItemDto(
     string SupplierName,
     string SupplierEmail,
     string SKU,
     string Name,
     int CurrentQty,
     int Threshold
    );
}
