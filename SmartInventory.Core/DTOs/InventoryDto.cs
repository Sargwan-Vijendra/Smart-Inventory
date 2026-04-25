using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public class InventoryDto
    {
        public record StockAdjustmentRequest(
            int ProductId,
            int QuantityChange,
            string Type, // Add, Remove, Damage, Return
            string Remarks
        );

        public record AdjustmentResponse(
            bool Success,
            int NewQuantity,
            bool IsLowStock,
            string Message
        );

        public record StockLogViewDto(
            int LogId,
            int ChangeAmount,
            string Reason,
            DateTime CreatedAt
        );

        public record LowStockDto(
            int ProductId,
            string SKU,
            string ProductName,
            int CurrentQuantity,
            int MinThreshold,
            string CategoryName
        );


       public record LowStockDtoPagedResponseDto(
       IEnumerable<LowStockDto> Items,
       int TotalCount,
       int PageNumber,
       int PageSize
   );
    }
}
