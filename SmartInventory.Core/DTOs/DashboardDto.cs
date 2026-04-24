using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.DTOs
{
    public class DashboardDto
    {
        public decimal TotalStockValue { get; set; }
        public int LowStockCount { get; set; }
        public List<TopMovingItemDto> TopMovingItems { get; set; } = new();
        public List<CategoryStockDto> StockByCategory { get; set; } = new();
    }

    public record TopMovingItemDto(string Name, int TotalMoved);
    public record CategoryStockDto(string CategoryName, int ItemCount);
}
