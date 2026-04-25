using SmartInventory.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Data.Interfaces
{
    public interface IReportRepository
    {
        Task<IEnumerable<ReorderItemDto>> GetItemsToReorderAsync(int supplierId);

        Task<DashboardDto> GetDashboardStatsAsync();

    }
}
