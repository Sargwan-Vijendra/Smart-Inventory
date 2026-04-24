using SmartInventory.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static SmartInventory.Core.DTOs.InventoryDto;

namespace SmartInventory.Data.Interfaces
{
    public interface IInventoryRepository
    {
        Task<AdjustmentResponse> AdjustStockAsync(StockAdjustmentRequest request);
        Task<IEnumerable<StockLogViewDto>> GetLogsByProductIdAsync(int productId);

        Task<IEnumerable<LowStockDto>> GetLowStockReportAsync();

        Task<DashboardDto> GetDashboardStatsAsync();
    }
}
